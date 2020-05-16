
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
import GetSummaryMockData from './MPFService_GetSummaryByCategories_MockData.json';


describe("MPFService", () => {

    let mpfService: MPFService;


    beforeAll(() => {

        mockAxios.post.mockImplementation((url, reqBody:any, headers:any) => {
            if (url.endsWith("price")) {
                return Promise.resolve(GetFundPricesMockData);
            } else {
                return Promise.resolve(GetSummaryMockData);
            }
        })

        mockAxios.get.mockImplementation((url, axiosRequestConfig) => {

            // console.log("mockAxios.get - url = " + url);
            return Promise.resolve(GetCatalogMockData);
        });

        mpfService = MPFService.getInstance();

      });

    test('getInstance', async () => {
        expect(mpfService).toBeDefined();
    });


    test("getTrustees", async () => {
        const trustees = await mpfService.getTrustees();
        expect(trustees.length).toBeGreaterThan(0);
    });

    test("getTrustee", async () => {
        const trustee = await mpfService.getTrustee("HSBC");
        expect(trustee.length).toBeGreaterThan(0);
    });

    test('getFunds', async () => {

        const trustee = "HSBC";
        const scheme = "SuperTrust Plus";

        let funds: MPFFund[]  = await mpfService.getFunds(trustee, scheme);

        expect(mockAxios.get).toHaveBeenCalled();
        expect(funds.length).toBeGreaterThan(0);

    });

    test("getCatalog", async () => {

        const catalog = await mpfService.getCatalog();
        expect(catalog).toBeDefined();
        expect(catalog.length).toBeGreaterThan(0);

    });

    test("getSummaryByFunds", async () => {

        const funds: MPFFund[] = [
            {trustee: "HSBC", scheme: "SuperTrust Plus", fund: "Age 65 Fund"},
            {trustee: "HSBC", scheme: "SuperTrust Plus", fund: "Balanced Fund"},
        ];

        const summary = await mpfService.getSummaryByFunds(funds);

        expect(summary).toBeDefined();
        expect(summary.length).toBeGreaterThan(0);

    });


    test("getSummaryByCategories", async () => {

        const categories = ["Equity Funds", "Mixed Asset Funds"];

        const summary = await mpfService.getSummaryByCategories(categories);

        expect(summary).toBeDefined();
        expect(summary.length).toBeGreaterThan(0);

    });

    test('getFundPrices', async () => {

        let query =  {
            funds: [{
                trustee: "HSBC",
                scheme: "SuperTrust Plus",
                fund: "Age 65 Plus Fund"
            }],
            startDate: 20191101,
            endDate: 20200201,
            timePeriod: "M"
        }

        let prices: MPFFundPrice[]  = await mpfService.getFundPrices(query);

        expect(mockAxios.get).toHaveBeenCalled();
        expect(prices.length).toBeGreaterThan(0);


    });


});