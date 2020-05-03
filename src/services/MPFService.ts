import axios, {AxiosRequestConfig} from 'axios';
import moment from 'moment';
import { AuthService } from './AuthService';
import { ConfigService } from './ConfigService';
import { pathToFileURL } from 'url';

export interface MPFFundPriceQuery {
    startDate: number;
    endDate: number;
    timePeriod?: string;
    funds: MPFFund[];
}

export interface MPFFundPrice {
    trustee: string;
    scheme: string;
    fund: string;
    prices: FundPrice[];
}

export interface FundPrice {
    date: number;
    price: number;
}

export interface MPFFund {
    trustee: string;
    scheme: string;
    fund: string;
}

export interface MPFCatalog {
    fund: MPFFund;
    categories: string[];
}

export interface MPFFundSummary {
    fund: MPFFund;
    mth1: number;
    mth3: number;
    mth6: number;
    mth12: number;
}


export class MPFService {

    private static instance: MPFService;

    private authService = AuthService.getInstance();
    private configService = ConfigService.getInstance();

    // private authService: AuthService | null = null;
    // private configService: ConfigService | null = null;

    private apiEndpoint = "";
    private apiKey = "";

    private mpfCatalog: MPFCatalog[] = [];

    private initializationInProgressCount = 0;

    private constructor() { }

    static getInstance() {
        if (!MPFService.instance) {
            MPFService.instance = new MPFService();
        }

        return MPFService.instance;
    }

    async initialize(force = false) {

        // this.initializationInProgressCount++;
        // if (this.initializationInProgressCount > 1) {
        //     setTimeout(() => { this.initialize(force) }, 1000);
        //     return;
        // }
            
        console.log("MPFService.initialize() - " + force);

        // if (!this.isInitializationInProgress) this.isInitializationInProgress = true;
        // else setTimeout(() => { this.initialize(force) }, 1000);

        if (!this.apiEndpoint || force) {
            this.apiEndpoint = await this.configService.getProperty("app/api/endpoint");
            console.log("MPFService() - Initialize API Endpoint = " + this.apiEndpoint);
        }
        if (!this.apiKey || force) { 
            this.apiKey = await this.configService.getProperty("app/api/key");
            console.log("MPFService() - Initialize API Key");
        }

        if (this.mpfCatalog.length == 0 || force) { 
            await this.initalizeCatalog();
            console.log("MPFService() - Initialize MPF Catalog");
        }

        // this.initializationInProgressCount--;

    }

    private async initalizeCatalog() {
        if (this.mpfCatalog == null || this.mpfCatalog.length == 0)
            this.mpfCatalog = await this.getCatalog();
    }

    async getSummaryByFunds(funds: MPFFund[]): Promise<MPFFundSummary[]> {

        console.debug("sending request ");

        try {
            const response: any = await this.httpPost("performance", JSON.stringify(funds));
            // console.log("getSummary() - response = " + JSON.stringify(response));
            let formattedResponse = this.formatFundSummaryResult(response.data);
            // console.log("getSummary() - formattedResponse = " + JSON.stringify(formattedResponse));
            return formattedResponse;
        } catch (e) {
            console.error(e);
            throw e;
        }

    }

    async getSummaryByCategories(categories: string[]): Promise<MPFFundSummary[]> {

        try {

            console.log("getSummaryByCategories() - " + JSON.stringify(categories));

            await this.initalizeCatalog();

            const categorySet = new Set<string>(categories);

            let funds = this.mpfCatalog
            .filter(catalog => {
                for (let i = 0; i < catalog.categories.length; i++) {
                    if (categorySet.has(catalog.categories[i]))
                        return true;
                }
            })
            .map(catalog => catalog.fund);

            console.log("getSummaryByCategories() - funds = " + JSON.stringify(funds));

            const response: any = await this.httpPost("performance", JSON.stringify(funds));
            // console.log("getSummary() - response = " + JSON.stringify(response));
            let formattedResponse = this.formatFundSummaryResult(response.data);
            // console.log("getSummaryByCategories() - formattedResponse = " + JSON.stringify(formattedResponse));
            return formattedResponse;
        } catch (e) {
            console.error(e);
            throw e;
        }

    }

    async getFundPrices(query: MPFFundPriceQuery): Promise<MPFFundPrice[]> {

        console.debug("sending request ");

        let reqBody: any = this.buildParams(query);

        try {
            const response: any = await this.httpPost("price", reqBody);
            return this.formatFundPriceResult(response.data);
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    async getTrustees(): Promise<string[]> {
        console.debug("getTrustees() - " + this.apiEndpoint);

        try {
            // const response: any = await this.httpGet("/");
            // return response.data;

            await this.initalizeCatalog();

            let trusteeSet = new Set<string>();

            this.mpfCatalog.forEach(item => {
                trusteeSet.add(item.fund.trustee);
            });

            return Array.from(trusteeSet);

        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    async getTrustee(trustee: string): Promise<MPFFund[]> {

        console.debug("getTrustee()");
        console.debug("trustee: " + trustee);

        try {
            // const response: any = await this.httpGet(trustee);
            // return response.data;

            await this.initalizeCatalog();

            let funds: MPFFund[] = 
            this.mpfCatalog
            .filter(item => item.fund.trustee === trustee)
            .map(item => {
                return item.fund;
            });

            return funds;

        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    async getFunds(trustee: string, scheme: string): Promise<MPFFund[]> {
        console.debug("trustee: " + trustee + ", scheme: " + scheme);
        try {

            await this.initalizeCatalog();
            let funds: MPFFund[] = 
            this.mpfCatalog
            .filter(item => (item.fund.trustee === trustee && item.fund.scheme === scheme))
            .map(item => item.fund );

            return funds;

        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    async getCategories(): Promise<string[]> {
        try {
            await this.getCatalog();
            let categories = new Set<string>();
            this.mpfCatalog.forEach(item => {
                item.categories.forEach(category => {
                    categories.add(category);
                })
            })

            return Array.from(categories);

        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    async getCatalog(): Promise<MPFCatalog[]> {

        try {
            const response: any = await this.httpGet("catalog");
            let catalogList: MPFCatalog[] = response.data.map((item: any) => {

                let categories = item.category.split(",");
                categories = categories.map((item:string) => item.trim());

                return ({
                    fund: {trustee: item.trustee, scheme: item.scheme, fund: item.fund},
                    categories: categories
                });
            });
            return catalogList;

        } catch (e) {
            console.error(e);
            throw e;
        }

    }

    private async httpGet(apiPath: string): Promise<any> {

        if (this.apiEndpoint == null || this.apiEndpoint == "") {
            await this.initialize();
        }

        const requestOptions: AxiosRequestConfig = await this.prepareRequestConfig({});
        const url = encodeURI(this.apiEndpoint + apiPath);

        return await axios.get(url, requestOptions);
    }

    private async httpPost(apiPath: string, reqBody: string): Promise<any> {

        if (this.apiEndpoint == null || this.apiEndpoint == "") {
            await this.initialize();
        }

        const headers = await this.prepareRequestHeaders();
        const url = encodeURI(this.apiEndpoint + apiPath);

        return await axios.post(url, reqBody, { headers: headers});
    }

    private async prepareRequestHeaders(): Promise<any> {

        const idToken = await this.authService.generateIdToken();

        return  {
            "x-api-key": this.apiKey,
            "Authorization": "bearer " + idToken
         }
        
    }

    private async prepareRequestConfig(params: any, data: any = {}): Promise<AxiosRequestConfig> {

        const headers = await this.prepareRequestHeaders();

        return  {
            headers : headers,
            params: params,
            data: data
          };
    }

    private buildParams(query: MPFFundPriceQuery): any {
        let params: any = {};

        if (query.startDate) {
            params.startDate = query.startDate;            
        }

        if (query.endDate) {
            params.endDate = query.endDate;            
        }

        if (query.timePeriod) {
            params.timePeriod = query.timePeriod;      
        } else {
            params.timePeriod = "D"
        }

        params.funds = query.funds;

        return params;
    }

    private formatFundPriceResult(result: any) : Array<MPFFundPrice> {

        let formattedResult : Array<MPFFundPrice> = new Array();

        formattedResult = result.map( (item : any) => {

            let fundPrice = {   
                trustee: item.trustee, 
                scheme: item.scheme, 
                fund: item.fund, 
                prices: new Array<FundPrice>()
            };

            let prices = new Array<FundPrice>();
            for (let i = 0; i < item.prices.length; i++) {
                let priceItem = item.prices[i];
                prices.push({
                    date: priceItem.priceDate,
                    price: priceItem.price
                });
            }

            fundPrice.prices = prices;

            return fundPrice;

        });

        return formattedResult;
    }

    private formatFundSummaryResult(result: any) : Array<MPFFundSummary> {

        let formattedResult : Array<MPFFundSummary> = new Array();

        formattedResult = result.map( (item : any) => {

            const fund = {   
                trustee: item.trustee, 
                scheme: item.scheme, 
                fund: item.fund, 
            };

            const fundSummary: MPFFundSummary = {
                fund: fund,
                mth1: item.growth1Month,
                mth3: item.growth3Month,
                mth6: item.growth6Month,
                mth12: item.growth12Month,

            }

            return fundSummary;

        });

        return formattedResult;
    }

    private formatFundListResult(result: any) : Array<MPFFund> {

        let formattedResult : Array<MPFFund> = new Array();

        formattedResult = result.map( (item : any) => {
            return {
                trustee: item.trustee,
                scheme: item.scheme,
                fund: item.fund
            }
        });

        return formattedResult;
    }

}

