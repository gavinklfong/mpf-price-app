import axios, {AxiosRequestConfig} from 'axios';
import moment from 'moment';
import { AuthService } from './AuthService';

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

const MPF_BASE_URL = "https://ymfsropn9g.execute-api.us-east-2.amazonaws.com/dev/mpf/";

const API_KEY = "EKJRmsQhdN7PUvIY6RYJg1nhesEq95Rx41igtoFT";


export class MPFService {

    private authService: AuthService;

    constructor(authService: AuthService) {
        this.authService = authService;
    }

    async prepareRequestHeaders(): Promise<any> {

        const idToken = await this.authService.generateIdToken();

        return  {
            "x-api-key": API_KEY,
            "Authorization": "bearer " + idToken
         }
        
    }


    async prepareRequestConfig(params: any, data: any = {}): Promise<AxiosRequestConfig> {

        const headers = await this.prepareRequestHeaders();

        return  {
            headers : headers,
            params: params,
            data: data
          };
    }
    
    async getFundPrices(query: MPFFundPriceQuery): Promise<MPFFundPrice[]> {

        console.debug("sending request : " + encodeURI(MPF_BASE_URL));

        let reqBody: any = this.buildParams(query);
        let headers = await this.prepareRequestHeaders();

        let completedUrl = MPF_BASE_URL + "price";
          
        console.debug("completedUrl : " + completedUrl);

        try {
            const response: any = await axios.post(encodeURI(completedUrl), reqBody, { headers: headers});
            return this.formatFundPriceResult(response.data);
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    async getTrustees(): Promise<string[]> {
        console.debug("getTrustees()");

        const requestOptions: AxiosRequestConfig = await this.prepareRequestConfig({});

        try {
            const response: any = await axios.get(encodeURI(MPF_BASE_URL), requestOptions);
            return response.data;
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    async getTrustee(trustee: string): Promise<MPFFund[]> {

        console.debug("getTrustee()");
        console.debug("trustee: " + trustee);

        let completedUrl = MPF_BASE_URL + trustee;

        let requestOptions: AxiosRequestConfig = await this.prepareRequestConfig({});

        try {
            const response:any = await axios.get(encodeURI(completedUrl), requestOptions);
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
        
        let completedUrl = MPF_BASE_URL + urlPath;
        console.log("completedUrl : " + completedUrl);

        let requestOptions: AxiosRequestConfig = await this.prepareRequestConfig({});

        try {
            const response:any = axios.get(encodeURI(completedUrl), requestOptions);
            return this.formatFundListResult(response.data.Items);
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    buildParams(query: MPFFundPriceQuery): any {
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

    formatFundPriceResult(result: any) : Array<MPFFundPrice> {

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

    formatFundListResult(result: any) : Array<MPFFund> {

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

