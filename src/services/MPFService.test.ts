import { MPFService, MPFFundPrice } from './MPFService'
import axios, {AxiosRequestConfig} from 'axios';

jest.mock('axios');
const mockAxios = axios as jest.Mocked<typeof axios>;


it('getFundPrices', async () => {

    const MPF_URL = encodeURI("https://aifobzeuf2.execute-api.us-east-2.amazonaws.com/dev/mpf/HSBC/schemes/SuperTrust Plus/funds/North American Equity Fund/price?startDate=20190101&endDate=20200115&timePeriod=M");

    mockAxios.get.mockResolvedValue(mockResp);


    let mpfService = new MPFService();

    let query =  {
        trustee: "HSBC",
        scheme: "Trust Plus",
        fund: "Fund Name",
        startDate: 20200101,
        endDate: 20200201,
        timePeriod: "M"
    }

    let prices: MPFFundPrice[]  = await mpfService.getFundPrices(query);

    console.log("MPFFundPrice: " + JSON.stringify(prices));

    expect(mockAxios.get).toHaveBeenCalled();
    expect(prices.length).toBeGreaterThan(0);


});

const respHeader = {"headers": {"x-api-key": "Whalebig27Whalebig27"}, "method": "GET"};

const mockResp = 
{   
    "status": 200,
    "data":
    {
        "Items": [
            {
                "fundName": "North American Equity Fund",
                "scheme": "SuperTrust Plus",
                "priceDate": 1546300800000,
                "price": 15.030714285714286,
                "trustee": "HSBC",
                "trusteeSchemeFundId": "HSBC-SuperTrust Plus-North American Equity Fund"
            },
            {
                "fundName": "North American Equity Fund",
                "scheme": "SuperTrust Plus",
                "priceDate": 1548979200000,
                "price": 15.98235294117647,
                "trustee": "HSBC",
                "trusteeSchemeFundId": "HSBC-SuperTrust Plus-North American Equity Fund"
            },
            {
                "fundName": "North American Equity Fund",
                "scheme": "SuperTrust Plus",
                "priceDate": 1554076800000,
                "price": 16.89,
                "trustee": "HSBC",
                "trusteeSchemeFundId": "HSBC-SuperTrust Plus-North American Equity Fund"
            },
            {
                "fundName": "North American Equity Fund",
                "scheme": "SuperTrust Plus",
                "priceDate": 1556668800000,
                "price": 16.47904761904762,
                "trustee": "HSBC",
                "trusteeSchemeFundId": "HSBC-SuperTrust Plus-North American Equity Fund"
            },
            {
                "fundName": "North American Equity Fund",
                "scheme": "SuperTrust Plus",
                "priceDate": 1559347200000,
                "price": 16.67473684210526,
                "trustee": "HSBC",
                "trusteeSchemeFundId": "HSBC-SuperTrust Plus-North American Equity Fund"
            },
            {
                "fundName": "North American Equity Fund",
                "scheme": "SuperTrust Plus",
                "priceDate": 1561939200000,
                "price": 17.28818181818182,
                "trustee": "HSBC",
                "trusteeSchemeFundId": "HSBC-SuperTrust Plus-North American Equity Fund"
            },
            {
                "fundName": "North American Equity Fund",
                "scheme": "SuperTrust Plus",
                "priceDate": 1564617600000,
                "price": 16.721363636363634,
                "trustee": "HSBC",
                "trusteeSchemeFundId": "HSBC-SuperTrust Plus-North American Equity Fund"
            },
            {
                "fundName": "North American Equity Fund",
                "scheme": "SuperTrust Plus",
                "priceDate": 1567296000000,
                "price": 17.20047619047619,
                "trustee": "HSBC",
                "trusteeSchemeFundId": "HSBC-SuperTrust Plus-North American Equity Fund"
            },
            {
                "fundName": "North American Equity Fund",
                "scheme": "SuperTrust Plus",
                "priceDate": 1569888000000,
                "price": 17.204761904761906,
                "trustee": "HSBC",
                "trusteeSchemeFundId": "HSBC-SuperTrust Plus-North American Equity Fund"
            },
            {
                "fundName": "North American Equity Fund",
                "scheme": "SuperTrust Plus",
                "priceDate": 1572566400000,
                "price": 17.90904761904762,
                "trustee": "HSBC",
                "trusteeSchemeFundId": "HSBC-SuperTrust Plus-North American Equity Fund"
            },
            {
                "fundName": "North American Equity Fund",
                "scheme": "SuperTrust Plus",
                "priceDate": 1575158400000,
                "price": 18.244,
                "trustee": "HSBC",
                "trusteeSchemeFundId": "HSBC-SuperTrust Plus-North American Equity Fund"
            },
            {
                "fundName": "North American Equity Fund",
                "scheme": "SuperTrust Plus",
                "priceDate": 1577836800000,
                "price": 18.586000000000002,
                "trustee": "HSBC",
                "trusteeSchemeFundId": "HSBC-SuperTrust Plus-North American Equity Fund"
            }
        ],
        "Count": 12,
        "ScannedCount": 12
    }
};