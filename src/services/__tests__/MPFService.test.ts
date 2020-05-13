
import { MPFService  } from '../MPFService';
import { MPFFundPrice, MPFFund } from '../../models/MPFFundModel';

import { ConfigService } from '../ConfigService';
jest.mock('../ConfigService.ts');

import { AuthService } from '../AuthService';
jest.mock('../AuthService.ts');


import axios, {AxiosRequestConfig} from 'axios';
jest.mock('axios');
export const mockAxios = axios as jest.Mocked<typeof axios>;

import GetCatalogMockData from './MPFService_GetCatalog_MockData.json';
import GetFundPricesMockData from './MPFService_GetFundPrices_MockData.json';


describe("MPFService", () => {

    beforeAll(() => {

        mockAxios.post.mockResolvedValue(GetFundPricesMockData);

        mockAxios.get.mockImplementation((url, axiosRequestConfig) => {

            console.log("mockAxios.get - url = " + url);

            if (url.endsWith("catalog"))
                return Promise.resolve(GetCatalogMockData);
            else 
                return Promise.resolve(mockFundsResp);
        });
      });

    test('getInstance', async () => {
        const mpfService = MPFService.getInstance();
        expect(mpfService).toBeDefined();
    });

    test('getFundPrices', async () => {

        const MPF_URL = encodeURI("https://aifobzeuf2.execute-api.us-east-2.amazonaws.com/dev/mpf/HSBC/schemes/SuperTrust Plus/funds/North American Equity Fund/price?startDate=20190101&endDate=20200115&timePeriod=M");

        mockAxios.post.mockResolvedValue(mockFundPriceResp);


        const mpfService = MPFService.getInstance();

        let query =  {
            funds: [{
                trustee: "HSBC",
                scheme: "SuperTrust Plus",
                fund: "North American Equity Fund"
            }],
            startDate: 20191101,
            endDate: 20200201,
            timePeriod: "M"
        }

        let prices: MPFFundPrice[]  = await mpfService.getFundPrices(query);

        console.log("MPFFundPrice: " + JSON.stringify(prices));

        expect(mockAxios.get).toHaveBeenCalled();
        expect(prices.length).toBeGreaterThan(0);


    });

    test('getFunds', async () => {

        const trustee = "HSBC";
        const scheme = "SuperTrust Plus";

        const mpfService = MPFService.getInstance();

        let funds: MPFFund[]  = await mpfService.getFunds(trustee, scheme);

        // console.log("MPFFund: " + JSON.stringify(funds));

        expect(mockAxios.get).toHaveBeenCalled();
        expect(funds.length).toBeGreaterThan(0);

    });

    test("getCatalog", async () => {

        const mpfService = MPFService.getInstance();
        const catalog = await mpfService.getCatalog();
        expect(catalog).toBeDefined();


    });


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
