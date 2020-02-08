import axios, {AxiosRequestConfig} from 'axios';

export interface MPFFundPriceQuery {
    trustee: string;
    scheme: string;
    fund: string;
    startDate: number;
    endDate: number;
    timePeriod: string;
}

export interface MPFFundPrice {
    trustee: string;
    scheme: string;
    fund: string;
    date: number;
    price: number;
}

const MPF_URL = "https://aifobzeuf2.execute-api.us-east-2.amazonaws.com/dev/mpf/HSBC/schemes/SuperTrust Plus/funds/North American Equity Fund/price?startDate=20190101&endDate=20200115&timePeriod=M";

export class MPFService {

    getFundPrices(query: MPFFundPriceQuery): Promise<MPFFundPrice[]> {

        console.log("sending request : " + encodeURI(MPF_URL));

        // return fetch (encodeURI(MPF_URL), {
        //     method: 'GET',
        //     headers: {
        //         'x-api-key': "Whalebig27Whalebig27"
        //     }
        // })
        // .then(res => res.json())
        // .then(res => res.map((funds : any) => this.formatFundPriceResult(funds)))
        // .catch(e => {
        //     console.log(e);
        // })

        let requestOptions: AxiosRequestConfig = {
            method: 'GET',
            headers : {
                "x-api-key": "Whalebig27Whalebig27"
            }
          };
          
          return axios.get(encodeURI("https://114teod1fc.execute-api.us-east-2.amazonaws.com/dev/mpf/HSBC/schemes/SuperTrust Plus/funds/North American Equity Fund/price?startDate=20190101&endDate=20200115&timePeriod=M"), requestOptions)
            .then((response: any)  => { 
                console.log(response.data.Items);
                return response.data.Items;
            })
            .then(res => this.formatFundPriceResult(res))
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

}

