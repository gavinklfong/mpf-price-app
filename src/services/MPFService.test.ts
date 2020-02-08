import { MPFService, MPFFundPrice, MPFFund } from './MPFService'
import axios, {AxiosRequestConfig} from 'axios';

jest.mock('axios');
const mockAxios = axios as jest.Mocked<typeof axios>;


it('getFundPrices', async () => {

    const MPF_URL = encodeURI("https://aifobzeuf2.execute-api.us-east-2.amazonaws.com/dev/mpf/HSBC/schemes/SuperTrust Plus/funds/North American Equity Fund/price?startDate=20190101&endDate=20200115&timePeriod=M");

    mockAxios.get.mockResolvedValue(mockFundPriceResp);


    let mpfService = new MPFService();

    let query =  {
        trustee: "HSBC",
        scheme: "SuperTrust Plus",
        fund: "North American Equity Fund",
        startDate: 20191101,
        endDate: 20200201,
        timePeriod: "M"
    }

    let prices: MPFFundPrice[]  = await mpfService.getFundPrices(query);

    console.log("MPFFundPrice: " + JSON.stringify(prices));

    expect(mockAxios.get).toHaveBeenCalled();
    expect(prices.length).toBeGreaterThan(0);


});

it('getFunds', async () => {

    const MPF_URL = encodeURI("https://aifobzeuf2.execute-api.us-east-2.amazonaws.com/dev/mpf/HSBC/schemes/SuperTrust Plus/funds");
    mockAxios.get.mockResolvedValue(mockFundsResp);

    const trustee = "HSBC";
    const scheme = "SuperTrust Plus";

    let mpfService = new MPFService();

    let funds: MPFFund[]  = await mpfService.getFunds(trustee, scheme);

    console.log("MPFFund: " + JSON.stringify(funds));

    expect(mockAxios.get).toHaveBeenCalled();
    expect(funds.length).toBeGreaterThan(0);


});

const mockFundsResp =
{   
    "status": 200,
    "data":
    {
        "Items": [
            {
                "fund": "Hang Seng Index Tracking Fund",
                "trustee": "HSBC",
                "scheme": "SuperTrust Plus"
            },
            {
                "fund": "European Equity Fund",
                "trustee": "HSBC",
                "scheme": "SuperTrust Plus"
            },
            {
                "fund": "North American Equity Fund",
                "trustee": "HSBC",
                "scheme": "SuperTrust Plus"
            }
        ],
        "Count": 3,
        "ScannedCount": 3
    } 
};

const respHeader = {"headers": {"x-api-key": "Whalebig27Whalebig27"}, "method": "GET"};

const mockFundPriceResp = 
{   
    "status": 200,
    "data":
    [
        {
            "trusteeSchemeFundId": "HSBC-SuperTrust Plus-North American Equity Fund",
            "trustee": "HSBC",
            "scheme": "SuperTrust Plus",
            "fundName": "North American Equity Fund",
            "priceDate": "20190101",
            "price": 15.030714285714286
        },
        {
            "trusteeSchemeFundId": "HSBC-SuperTrust Plus-North American Equity Fund",
            "trustee": "HSBC",
            "scheme": "SuperTrust Plus",
            "fundName": "North American Equity Fund",
            "priceDate": "20190201",
            "price": 15.98235294117647
        },
        {
            "trusteeSchemeFundId": "HSBC-SuperTrust Plus-North American Equity Fund",
            "trustee": "HSBC",
            "scheme": "SuperTrust Plus",
            "fundName": "North American Equity Fund",
            "priceDate": "20190401",
            "price": 16.89
        },
        {
            "trusteeSchemeFundId": "HSBC-SuperTrust Plus-North American Equity Fund",
            "trustee": "HSBC",
            "scheme": "SuperTrust Plus",
            "fundName": "North American Equity Fund",
            "priceDate": "20190501",
            "price": 16.47904761904762
        },
        {
            "trusteeSchemeFundId": "HSBC-SuperTrust Plus-North American Equity Fund",
            "trustee": "HSBC",
            "scheme": "SuperTrust Plus",
            "fundName": "North American Equity Fund",
            "priceDate": "20190601",
            "price": 16.67473684210526
        },
        {
            "trusteeSchemeFundId": "HSBC-SuperTrust Plus-North American Equity Fund",
            "trustee": "HSBC",
            "scheme": "SuperTrust Plus",
            "fundName": "North American Equity Fund",
            "priceDate": "20190701",
            "price": 17.28818181818182
        },
        {
            "trusteeSchemeFundId": "HSBC-SuperTrust Plus-North American Equity Fund",
            "trustee": "HSBC",
            "scheme": "SuperTrust Plus",
            "fundName": "North American Equity Fund",
            "priceDate": "20190801",
            "price": 16.721363636363634
        },
        {
            "trusteeSchemeFundId": "HSBC-SuperTrust Plus-North American Equity Fund",
            "trustee": "HSBC",
            "scheme": "SuperTrust Plus",
            "fundName": "North American Equity Fund",
            "priceDate": "20190901",
            "price": 17.20047619047619
        },
        {
            "trusteeSchemeFundId": "HSBC-SuperTrust Plus-North American Equity Fund",
            "trustee": "HSBC",
            "scheme": "SuperTrust Plus",
            "fundName": "North American Equity Fund",
            "priceDate": "20191001",
            "price": 17.204761904761906
        },
        {
            "trusteeSchemeFundId": "HSBC-SuperTrust Plus-North American Equity Fund",
            "trustee": "HSBC",
            "scheme": "SuperTrust Plus",
            "fundName": "North American Equity Fund",
            "priceDate": "20191101",
            "price": 17.90904761904762
        },
        {
            "trusteeSchemeFundId": "HSBC-SuperTrust Plus-North American Equity Fund",
            "trustee": "HSBC",
            "scheme": "SuperTrust Plus",
            "fundName": "North American Equity Fund",
            "priceDate": "20191201",
            "price": 18.244
        },
        {
            "trusteeSchemeFundId": "HSBC-SuperTrust Plus-North American Equity Fund",
            "trustee": "HSBC",
            "scheme": "SuperTrust Plus",
            "fundName": "North American Equity Fund",
            "priceDate": "20200101",
            "price": 18.586000000000002
        }
    ]
};