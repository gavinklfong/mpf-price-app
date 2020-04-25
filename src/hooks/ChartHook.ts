import moment from 'moment';
import { Observable, of } from 'rxjs';
import { map, switchMap, startWith,tap } from 'rxjs/operators'
import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import ChartComponent, { ChartDataPoint, ChartDataset, Props as ChartProps }  from '../components/ChartComponent';
import { MPFService, MPFFundPrice, MPFFund, FundPrice, MPFFundPriceQuery } from '../services/MPFService';
import { useService } from './ServiceHook';

export interface ChartTabForm {
    trusteeList?: string[],
    schemeList?: string[],
    fundList?: string[],
 
    trustee: string,
    scheme: string,
    funds?: string[],
    selectedFundText: string,
 
    fundRecords?: MPFFund[]
 
    displayInPercent: boolean,
    queryTimeRange: number,
    timePeriod: string,
    
    fundPriceMap?: Map<MPFFund, MPFFundPrice>,
 
    chartDatasets?: ChartDataset[],
    chartLabels?: string[]
 }


const randomNumber = (min:number, max:number) => Math.floor(Math.random() * (max - min + 1) + min);
const randomByte = () => randomNumber(0, 255)
const randomPercent = () => (randomNumber(50, 100) * 0.01).toFixed(2)
const randomCssRgba = () => `rgba(${[randomByte(), randomByte(), randomByte(), randomPercent()].join(',')})`

const stringHasValue = (value: string | undefined): boolean => (!!value && typeof value !== "undefined" && value.length > 0)
const arrayHasValue = (value: Array<any> | undefined): boolean => (!!value && typeof value !== "undefined" && value.length > 0)


export const useChart = (chartTabForm: ChartTabForm, setChartTabForm: Dispatch<SetStateAction<ChartTabForm>>, setShowLoading: Dispatch<SetStateAction<boolean>>) => {

    const mpfService: MPFService = useService("mpfService");

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


            mpfService.getTrustee(chartTabForm.trustee)
            .then(fundRecords => {
                setShowLoading(true);


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

                setShowLoading(false);
            
            });

        }

    }, [chartTabForm.trustee]);

    useEffect(() => {

        console.debug("useEffect() - schemeSelected() - [" + chartTabForm.scheme + "]");
        
        if (stringHasValue(chartTabForm.scheme) && arrayHasValue(chartTabForm.fundRecords)) {
            let fundList = chartTabForm.fundRecords!.filter(item => item.scheme === chartTabForm.scheme).map(item => item.fund);
            if (arrayHasValue(chartTabForm.schemeList)) {
                let fund = [fundList[0]];
                setChartTabForm({...chartTabForm, fundList: fundList, funds: fund, selectedFundText: fundList[0]});  
            }
        }

    }, [chartTabForm.scheme]);

    useEffect(() => {

        (async() => {
        console.debug("useEffect() - fundSelected() - [" + chartTabForm.funds + "]");

        if (chartTabForm.funds && chartTabForm.funds.length > 0) {
    
            setShowLoading(true);
            console.debug("fetching fund prices");

            let queryFunds = new Array<MPFFund>();
            for (let i = 0; i < chartTabForm.funds.length; i++) {
                queryFunds.push({trustee: chartTabForm.trustee, scheme: chartTabForm.scheme, fund: chartTabForm.funds[i]})
            }

            let fundPriceQuery: MPFFundPriceQuery = {
                startDate: +(moment().subtract(chartTabForm.queryTimeRange, "months").format("YYYYMMDD")),
                endDate: +(moment().format("YYYYMMDD")),
                timePeriod: chartTabForm.timePeriod,
                funds: queryFunds
            }

            let fundPriceMap = new Map<MPFFund, MPFFundPrice>();

            let retrievedFundPrices = await mpfService.getFundPrices(fundPriceQuery);

            retrievedFundPrices.forEach(item => {
                console.debug("retrieved fund price item: " + JSON.stringify(item));
                fundPriceMap.set({trustee: item.trustee, scheme: item.scheme, fund: item.fund}, item);
            });

            setChartTabForm({...chartTabForm, fundPriceMap: fundPriceMap});
            setShowLoading(false);
            
        }
        })();

    }, [chartTabForm.funds, chartTabForm.timePeriod, chartTabForm.queryTimeRange]);

    useEffect(() => { 

        console.debug("useEffect() selected fund price change");
        console.debug("fundPriceMap : " + chartTabForm.fundPriceMap?.size)
        console.debug("displayInPercent : " + chartTabForm.displayInPercent)

        if (!!chartTabForm.fundPriceMap && chartTabForm.fundPriceMap.size > 0) {

            console.debug(chartTabForm.fundPriceMap);

            setShowLoading(true);

            let chartDatasets = new Array<ChartDataset>();
            let chartXAxisLabels = new Array<string>();
            chartTabForm.fundPriceMap.forEach( (fundPrice, fund) => {
                const [labels, dataset] = prepareChartData2(fund, fundPrice.prices, chartTabForm.displayInPercent);
                chartDatasets.push(dataset);
                chartXAxisLabels = labels;
            });
            setChartTabForm({...chartTabForm, chartLabels: chartXAxisLabels, chartDatasets: chartDatasets}); 
            setShowLoading(false);
        }

    }, [chartTabForm.fundPriceMap, chartTabForm.displayInPercent]);



    // const prepareChartData = (fund: string, prices: Array<MPFFundPrice> = [], inPercent: boolean): [Array<string>, Array<ChartDataset>] => {
    //     console.debug("updateChartData()");
    
    //     let labels = Array<string>();
    //     let data = Array<ChartDataPoint>();
    
    //     if (prices && prices.length > 0) {
    
    //         let initialPrice = prices[0].price;
    //         prices.forEach((item: MPFFundPrice) => {
    //             let dateMoment = moment(item.date, "YYYYMMDD");
    //             let dateString = dateMoment.format("YYYY-MM-DD");
                
    //             labels.push(dateString);
        
    //             if (inPercent) {
    //                 let priceInPercent = ((item.price - initialPrice) / initialPrice) * 100;
    //                 data.push({x: dateString, y: priceInPercent});
    //             } else {
    //                 data.push({x: dateString, y: item.price});
    //             }
    //         });
    //     }
    
    //     let datasets = Array<ChartDataset>();
    //     datasets.push(
    //     {
    //         label: fund,
    //         data: data,
    //         borderColor: randomCssRgba(),
    //         fill: false
    //     }
    //     );
    
    //     return [labels, datasets];
    // }


    const prepareChartData2 = (fund: MPFFund, prices: FundPrice[], inPercent: boolean): [Array<string>, ChartDataset] => {
        console.debug("prepareChartData()");
    
        let labels = Array<string>();
        let data = Array<ChartDataPoint>();
    
        if (prices && prices.length > 0) {
    
            let initialPrice = prices[0].price;
            prices.forEach((item: FundPrice) => {
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
            label: fund.fund,
            data: data,
            borderColor: randomCssRgba(),
            fill: false
        };
    
        return [labels, dataset];
    }

   return [chartTabForm, setChartTabForm];

}