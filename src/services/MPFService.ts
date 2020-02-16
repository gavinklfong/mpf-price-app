import axios, {AxiosRequestConfig} from 'axios';
import moment from 'moment';

export interface MPFFundPriceQuery {
    trustee: string;
    scheme: string;
    fund: string;
    startDate: number;
    endDate: number;
    timePeriod?: string;
}

export interface MPFFundPrice {
    trustee: string;
    scheme: string;
    fund: string;
    date: number;
    price: number;
}

export interface MPFFund {
    trustee: string;
    scheme: string;
    fund: string;
}

const MPF_URL1 = "https://aifobzeuf2.execute-api.us-east-2.amazonaws.com/dev/mpf/HSBC/schemes/SuperTrust Plus/funds/North American Equity Fund/price?startDate=20190101&endDate=20200115&timePeriod=M";
const MPF_BASE_URL = "https://aifobzeuf2.execute-api.us-east-2.amazonaws.com/dev/mpf/";

const API_KEY = "Whalebig27Whalebig27";

export class MPFService {

    prepareRequestConfig(params: any): AxiosRequestConfig {
        return  {
            method: 'GET',
            headers : {
                "x-api-key": API_KEY
            },
            params: params
          };
    }
    

    getFundPrices(query: MPFFundPriceQuery): Promise<MPFFundPrice[]> {

        console.log("sending request : " + encodeURI(MPF_BASE_URL));

        let urlPathArray = new Array<String>()
        urlPathArray.push(query.trustee);
        urlPathArray.push("schemes");
        urlPathArray.push(query.scheme);
        urlPathArray.push("funds");
        urlPathArray.push(query.fund);
        urlPathArray.push("price");
        let urlPath = urlPathArray.join("/");

        let params: any = this.buildParams(query);

        let requestOptions: AxiosRequestConfig = this.prepareRequestConfig(params);

          let completedUrl = MPF_BASE_URL + urlPath;
          
          console.log("completedUrl : " + completedUrl);

          return axios.get(encodeURI(completedUrl), requestOptions)
            .then((response: any)  => { 
                console.log(response.data);
                return response.data;
            })
            .then(res => this.formatFundPriceResult(res))
    }

    getTrustees(): Promise<string[]> {
        console.log("getTrustee()");

        let requestOptions: AxiosRequestConfig = this.prepareRequestConfig({});

        return axios.get(encodeURI(MPF_BASE_URL), requestOptions)
          .then((response: any)  => { 
              console.log(response.data);
              return response.data;
          })
    }

    getTrustee(trustee: string): Promise<MPFFund[]> {

        console.log("getTrustee()");
        console.log("trustee: " + trustee);

        let urlPathArray = new Array<string>()
        urlPathArray.push(trustee);
        let urlPath = urlPathArray.join("/");  
        let completedUrl = MPF_BASE_URL + urlPath;
        let requestOptions: AxiosRequestConfig = this.prepareRequestConfig({});


        return axios.get(encodeURI(completedUrl), requestOptions)
          .then((response: any)  => { 
              console.log(response.data);
              return response.data;
          })
    }

    getFunds(trustee: string, scheme: string): Promise<MPFFund[]> {
        console.log("trustee: " + trustee + ", scheme: " + scheme);

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
              console.log(response.data.Items);
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
            return {   
                trustee: item.trustee, 
                scheme: item.scheme, 
                fund: item.fundName, 
                date: item.priceDate, 
                price: item.price
            };
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

