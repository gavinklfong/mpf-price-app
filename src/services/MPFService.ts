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

export interface MPFFundSummary {
    fund: MPFFund;
    mth1: number;
    mth3: number;
    mth6: number;
    mth12: number;
}


export class MPFService {

    private authService: AuthService;

    private configService: ConfigService;

    private apiEndpoint = "";
    private apiKey = "";

    constructor(authService: AuthService, configService: ConfigService) {
        this.authService = authService;
        this.configService = configService;
    }

    async initialize() {
        this.apiEndpoint = await this.configService.getProperty("app/api/endpoint");
        this.apiKey = await this.configService.getProperty("app/api/key");

        console.log("MPFService API Endpoint = " + this.apiEndpoint);
    }

    async getSummary(funds: MPFFund[]): Promise<MPFFundSummary[]> {

        console.debug("sending request ");

        try {
            const response: any = await this.httpPost("performance", JSON.stringify(funds));
            console.log("getSummary() - response = " + JSON.stringify(response));
            let formattedResponse = this.formatFundSummaryResult(response.data);
            console.log("getSummary() - formattedResponse = " + JSON.stringify(formattedResponse));
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
            const response: any = await this.httpGet("/");
            return response.data;
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    async getTrustee(trustee: string): Promise<MPFFund[]> {

        console.debug("getTrustee()");
        console.debug("trustee: " + trustee);

        try {
            const response: any = await this.httpGet(trustee);
            return response.data;
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    async getFunds(trustee: string, scheme: string): Promise<MPFFund[]> {
        console.debug("trustee: " + trustee + ", scheme: " + scheme);

        let urlPathArray = new Array<String>()
        urlPathArray.push(trustee);
        urlPathArray.push("schemes");
        urlPathArray.push(scheme);
        urlPathArray.push("funds");
        let urlPath = urlPathArray.join("/");   
        
        try {
            const response: any = await this.httpGet(urlPath);
            return this.formatFundListResult(response.data.Items);
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

