import axios, {AxiosRequestConfig} from 'axios';
import moment from 'moment';

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

const MPF_BASE_URL = "https://aifobzeuf2.execute-api.us-east-2.amazonaws.com/dev/mpf/";

const API_KEY = "Whalebig27Whalebig27";

export class MPFService {

    prepareRequestConfig(params: any, data: any = {}): AxiosRequestConfig {
        return  {
            headers : {
                "x-api-key": API_KEY
            },
            params: params,
            data: data
          };
    }
    
    getFundPrices(query: MPFFundPriceQuery): Promise<MPFFundPrice[]> {

        console.debug("sending request : " + encodeURI(MPF_BASE_URL));

        let params: any = this.buildParams(query);

        let requestOptions: AxiosRequestConfig = this.prepareRequestConfig(params, query);

        let completedUrl = MPF_BASE_URL + "price";
          
        console.debug("completedUrl : " + completedUrl);

        // completedUrl = "https://6pzv6l04kc.execute-api.us-east-2.amazonaws.com/dev/mpf/price"

        // requestOptions =  {
        //     headers : {
        //         "x-api-key": "12345678901234567890"
        //     },
        //     params: params,
        //     data: query
        //   };

        return axios.post(encodeURI(completedUrl), requestOptions)
        .then((response: any)  => { 
            console.log(response.data);
            return response.data;
        })
        .then(res => this.formatFundPriceResult(res))
    }

    getTrustees(): Promise<string[]> {
        console.debug("getTrustee()");

        let requestOptions: AxiosRequestConfig = this.prepareRequestConfig({});

        return axios.get(encodeURI(MPF_BASE_URL), requestOptions)
          .then((response: any)  => { 
            //   console.log(response.data);
              return response.data;
          })
    }

    getTrustee(trustee: string): Promise<MPFFund[]> {

        console.debug("getTrustee()");
        console.debug("trustee: " + trustee);

        let urlPathArray = new Array<string>()
        urlPathArray.push(trustee);
        let urlPath = urlPathArray.join("/");  
        let completedUrl = MPF_BASE_URL + urlPath;
        let requestOptions: AxiosRequestConfig = this.prepareRequestConfig({});


        return axios.get(encodeURI(completedUrl), requestOptions)
          .then((response: any)  => { 
            //   console.log(response.data);
              return response.data;
          })
    }

    getFunds(trustee: string, scheme: string): Promise<MPFFund[]> {
        console.debug("trustee: " + trustee + ", scheme: " + scheme);

        let urlPathArray = new Array<String>()
        urlPathArray.push(trustee);
        urlPathArray.push("schemes");
        urlPathArray.push(scheme);
        urlPathArray.push("funds");
        let urlPath = urlPathArray.join("/");   
        
        let completedUrl = MPF_BASE_URL + urlPath;
        console.log("completedUrl : " + completedUrl);

        let requestOptions: AxiosRequestConfig = this.prepareRequestConfig({});

        return axios.get(encodeURI(completedUrl), requestOptions)
          .then((response: any)  => { 
            //   console.log(response.data.Items);
              return response.data.Items;
          })
          .then(res => this.formatFundListResult(res))
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

