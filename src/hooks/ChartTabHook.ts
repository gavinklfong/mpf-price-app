import moment from 'moment';
import { Observable, of } from 'rxjs';
import { map, switchMap, startWith,tap } from 'rxjs/operators'
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
    
    fundPriceMap?: Map<string, MPFFundPrice[]>,
 
    chartDatasets?: ChartDataset[],
    chartLabels?: string[]
 }


const randomNumber = (min:number, max:number) => Math.floor(Math.random() * (max - min + 1) + min);
const randomByte = () => randomNumber(0, 255)
const randomPercent = () => (randomNumber(50, 100) * 0.01).toFixed(2)
const randomCssRgba = () => `rgba(${[randomByte(), randomByte(), randomByte(), randomPercent()].join(',')})`

const stringHasValue = (value: string | undefined): boolean => (!!value && typeof value !== "undefined" && value.length > 0)
const arrayHasValue = (value: Array<any> | undefined): boolean => (!!value && typeof value !== "undefined" && value.length > 0)

const mpfService = new MPFService();


export const useChartTab = (chartTabForm: ChartTabForm, setChartTabForm: Dispatch<SetStateAction<ChartTabForm>>, setShowLoading: Dispatch<SetStateAction<boolean>>) => {

      // retrieve trustee list
    useEffect(() => {

        mpfService.getTrustees()
        .then(trusteeList => {
            console.debug("retrieved trustees: " + trusteeList);
            let formData: ChartTabForm = {...chartTabForm, trusteeList: trusteeList};
            setChartTabForm(formData);    
        })
        
    }, []);

    useEffect(() => {

        console.debug("useEffect() - trusteeSelected() - [" + chartTabForm.trustee + "]");

        let scheme = "";

        if (stringHasValue(chartTabForm.trustee)) {
            // fetch trustee fund records

            setShowLoading(true);

            mpfService.getTrustee(chartTabForm.trustee)
            .then(fundRecords => {

                if (!!fundRecords && fundRecords.length > 0 ) {
                    // set scheme dropdown list
                    let schemeSet =  new Set<string>();
                    fundRecords.forEach(item => {
                        schemeSet.add(item.scheme);
                    });
                    let schemeList = Array.from(schemeSet);
                
                    // set selected scheme
                    scheme = schemeList[0];

                    setChartTabForm({...chartTabForm, fundRecords: fundRecords, schemeList: schemeList, scheme: scheme});
                } else {
                    setChartTabForm({...chartTabForm, fundRecords: [], schemeList: [], scheme: ""});
                }
            
            });

            setShowLoading(false);
        }

    }, [chartTabForm.trustee]);

    useEffect(() => {

        console.debug("useEffect() - schemeSelected() - [" + chartTabForm.scheme + "]");
        
        let fund = "";

        if (stringHasValue(chartTabForm.scheme) && arrayHasValue(chartTabForm.fundRecords)) {
            let fundList = chartTabForm.fundRecords!.filter(item => item.scheme === chartTabForm.scheme).map(item => item.fund);
            if (arrayHasValue(chartTabForm.schemeList)) {
                fund = fundList[0];
                fundList.unshift("-- All Funds --");
                setChartTabForm({...chartTabForm, fundList: fundList, fund: fund});  
            }
        }

    }, [chartTabForm.scheme]);

    useEffect(() => {

        (async() => {
        console.debug("useEffect() - fundSelected() - [" + chartTabForm.fund + "]");

        if (stringHasValue(chartTabForm.fund)) {
    
            setShowLoading(true);
            console.debug("fetching fund prices");

            let fundPriceQuery: MPFFundPriceQuery = 
            {  trustee: chartTabForm.trustee, scheme: chartTabForm.scheme, fund: chartTabForm.fund,
                startDate: +(moment().subtract(chartTabForm.queryTimeRange, "months").format("YYYYMMDD")),
                endDate: +(moment().format("YYYYMMDD")),
                timePeriod: chartTabForm.timePeriod }

            let fundPriceMap = new Map<string, MPFFundPrice[]>();

            if (chartTabForm.fund === "-- All Funds --") {

                for (let i = 0; i < chartTabForm.fundList!.length; i++) {
                    fundPriceQuery.fund = chartTabForm.fundList![i];
                    let retrievedFundPrices = await mpfService.getFundPrices(fundPriceQuery)
                    fundPriceMap.set(chartTabForm.fundList![i], retrievedFundPrices);
                }

                console.debug("end of fund loop");
                setChartTabForm({...chartTabForm, fundPriceMap: fundPriceMap});
                setShowLoading(false);

            } else {

                let retrievedFundPrices = await mpfService.getFundPrices(fundPriceQuery)
                fundPriceMap.set(chartTabForm.fund, retrievedFundPrices);
                setChartTabForm({...chartTabForm, fundPriceMap: fundPriceMap});
                setShowLoading(false);
            }
        }
        })();

    }, [chartTabForm.fund, chartTabForm.timePeriod, chartTabForm.queryTimeRange]);

    useEffect(() => { 

        console.debug("useEffect() selected fund price change");
        console.debug("fundPriceMap : " + chartTabForm.fundPriceMap?.size)
        console.debug("displayInPercent : " + chartTabForm.displayInPercent)

        if (!!chartTabForm.fundPriceMap && chartTabForm.fundPriceMap.size > 0) {

            setShowLoading(true);

            let chartDatasets = new Array<ChartDataset>();
            let chartXAxisLabels = new Array<string>();
            chartTabForm.fundPriceMap.forEach( (fundPrices, fund) => {
                const [labels, dataset] = prepareChartData2(fund, fundPrices, chartTabForm.displayInPercent);
                chartDatasets.push(dataset);
                chartXAxisLabels = labels;
            });
            setChartTabForm({...chartTabForm, chartLabels: chartXAxisLabels, chartDatasets: chartDatasets}); 
            setShowLoading(false);
        }

    }, [chartTabForm.fundPriceMap, chartTabForm.displayInPercent]);



    const prepareChartData = (fund: string, prices: Array<MPFFundPrice> = [], inPercent: boolean): [Array<string>, Array<ChartDataset>] => {
        console.debug("updateChartData()");
    
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


    const prepareChartData2 = (fund: string, prices: Array<MPFFundPrice> = [], inPercent: boolean): [Array<string>, ChartDataset] => {
        console.debug("updateChartData()");
    
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

        let dataset: ChartDataset = {
            label: fund,
            data: data,
            borderColor: randomCssRgba(),
            fill: false
        };
    
        return [labels, dataset];
    }

   return [chartTabForm, setChartTabForm];

}