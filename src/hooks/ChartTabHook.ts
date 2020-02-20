import moment from 'moment';
import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import ChartComponent, { ChartDataPoint, ChartDataset, Props as ChartProps }  from '../components/ChartComponent';
import { MPFService, MPFFundPrice, MPFFund, MPFFundPriceQuery } from '../services/MPFService';

export interface ChartTabForm {
    trusteeList?: string[],
    schemeList?: string[],
    fundList?: string[],
 
    trustee: string,
    scheme: string,
    fund: string,
 
    fundRecords?: MPFFund[]
 
    displayInPercent: boolean,
    queryTimeRange: number,
    timePeriod: string,
    
    fundPrices?: MPFFundPrice[],
 
    chartDatasets?: ChartDataset[],
    chartLabels?: string[]
 }

const randomNumber = (min:number, max:number) => Math.floor(Math.random() * (max - min + 1) + min);
const randomByte = () => randomNumber(0, 255)
const randomPercent = () => (randomNumber(50, 100) * 0.01).toFixed(2)
const randomCssRgba = () => `rgba(${[randomByte(), randomByte(), randomByte(), randomPercent()].join(',')})`

const mpfService = new MPFService();


export const useChartTab = (chartTabForm: ChartTabForm, setChartTabForm: Dispatch<SetStateAction<ChartTabForm>>) => {

    // const [chartTabForm, setChartTabForm] = useState<ChartTabForm>(
    //     {
    //        trustee: "HSBC", scheme: "", fund: "", 
    //        displayInPercent: true, timePeriod: "D",
    //        queryTimeRange: 1,
    //        chartLabels: [], chartDatasets: [],
    //        trusteeList: [], schemeList: [], fundList: []
    //     });
  

      // retrieve trustee list
    useEffect(() => {
        (async() => {
        let retrievedTrustees = await mpfService.getTrustees();
        console.log("retrieved trustees: " + retrievedTrustees);
        let formData: ChartTabForm = {...chartTabForm, trusteeList: retrievedTrustees};
        setChartTabForm(formData);

        }
        )();
    }, []);

    useEffect(() => {

        (async () => {
        console.log("useEffect() - trusteeSelected() - [" + chartTabForm.trustee + "]");

        let scheme = "";

        if (!!chartTabForm.trustee && typeof chartTabForm.trustee !== "undefined" && chartTabForm.trustee.length > 0 ) {
            // fetch trustee fund records

            // await loading.present();

            let fundRecords = await mpfService.getTrustee(chartTabForm.trustee);
        
            // set scheme dropdown list
            let schemeSet =  new Set<string>();
            fundRecords.forEach(item => {
                schemeSet.add(item.scheme);
            });
            let schemeList = Array.from(schemeSet);
        
            // set selected scheme
            if (!!schemeList && schemeList.length > 0) {
                scheme = schemeList[0];
            }

            setChartTabForm({...chartTabForm, fundRecords: fundRecords, schemeList: schemeList, scheme: scheme});

            // await loading.dismiss();

        }
        })()

    }, [chartTabForm.trustee]);

    useEffect(() => {

    (async () => {
        console.log("useEffect() - schemeSelected() - [" + chartTabForm.scheme + "]");
        
        let fund = "";

        if (!!chartTabForm.scheme && chartTabForm.scheme.length > 0 &&
        !!chartTabForm.fundRecords && chartTabForm.fundRecords.length > 0) {
        chartTabForm.fundList = chartTabForm.fundRecords.filter(item => item.scheme === chartTabForm.scheme).map(item => item.fund);
        if (!!chartTabForm.schemeList && chartTabForm.schemeList.length > 0) {
            fund = chartTabForm.fundList[0];
        }

        setChartTabForm({...chartTabForm, fund: fund});  
        }

    })()

    }, [chartTabForm.scheme]);

    useEffect(() => {

    ( async () => {

        console.log("useEffect() - fundSelected() - [" + chartTabForm.fund + "]");

        if (!!chartTabForm.fund && typeof chartTabForm.fund !== "undefined" && chartTabForm.fund.length > 0) {
    
            console.log("fetching fund prices");
            // await loading.present();

            // fetch fund prices
            let fundPriceQuery: MPFFundPriceQuery = 
            {  trustee: chartTabForm.trustee, scheme: chartTabForm.scheme, fund: chartTabForm.fund,
                startDate: +(moment().subtract(chartTabForm.queryTimeRange, "months").format("YYYYMMDD")),
                endDate: +(moment().format("YYYYMMDD")),
                timePeriod: chartTabForm.timePeriod }

            console.log("mpfService.getFundPrices()");
            let fundPrices = await mpfService.getFundPrices(fundPriceQuery);

            setChartTabForm({...chartTabForm, fundPrices: fundPrices});

            // await loading.dismiss();

        }

    })();

    }, [chartTabForm.fund, chartTabForm.timePeriod, chartTabForm.queryTimeRange]);

    useEffect(() => { 

    ( async () => {
        console.log("useEffect() selected fund price change");
        console.log("fundPrices : " + chartTabForm.fundPrices?.length)
        console.log("displayInPercent : " + chartTabForm.displayInPercent)

        if (!!chartTabForm.fundPrices && chartTabForm.fundPrices.length > 0) {

        // await loading.present();

        const [labels, datasets] = prepareChartData(chartTabForm.fund, chartTabForm.fundPrices, chartTabForm.displayInPercent);
        setChartTabForm({...chartTabForm, chartLabels: labels, chartDatasets: datasets}); 

        // await loading.dismiss();

        }

    })();

    }, [chartTabForm.fundPrices, chartTabForm.displayInPercent]);



    const prepareChartData = (fund: string, prices: Array<MPFFundPrice> = [], inPercent: boolean): [Array<string>, Array<ChartDataset>] => {
        console.log("updateChartData()");
    
        let labels = Array<string>();
        let data = Array<ChartDataPoint>();
    
        if (prices && prices.length > 0) {
    
            let initialPrice = prices[0].price;
            prices.forEach((item: MPFFundPrice) => {
            let dateMoment = moment(item.date, "YYYYMMDD");
            let dateString = dateMoment.format("YYYY-MM-DD");
            
            labels.push(dateString);
    
            if (inPercent) {
                let priceInPercent = ((item.price - initialPrice) / initialPrice) * 100;
                data.push({x: dateString, y: priceInPercent});
            } else {
                    data.push({x: dateString, y: item.price});
            }
            });
        }
    
        let datasets = Array<ChartDataset>();
        datasets.push(
        {
            label: fund,
            data: data,
            borderColor: randomCssRgba(),
            fill: false
        }
        );
    
        return [labels, datasets];
    }


   return [chartTabForm, setChartTabForm];

}