import moment from 'moment';
import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import {
    useIonViewWillEnter,
  } from '@ionic/react';
import { ChartDataPoint, ChartDataset }  from '../models/ChartDiagramModel';
import { MPFService } from '../services/MPFService';
import { MPFFundPrice, MPFFund, FundPrice, MPFFundPriceQuery } from '../models/MPFFundModel';
import { useAppContext, LoginSessionActionType } from './ContextHook';
import { ServiceFactory } from '../services/ServiceFactory';
import { ChartModel } from '../models/ChartModel';

const randomNumber = (min:number, max:number) => Math.floor(Math.random() * (max - min + 1) + min);
const randomByte = () => randomNumber(0, 255)
const randomPercent = () => (randomNumber(50, 100) * 0.01).toFixed(2)
const randomCssRgba = () => `rgba(${[randomByte(), randomByte(), randomByte(), randomPercent()].join(',')})`

const stringHasValue = (value: string | undefined): boolean => (!!value && typeof value !== "undefined" && value.trim().length > 0)
const arrayHasValue = (value: Array<any> | undefined): boolean => (!!value && typeof value !== "undefined" && value.length > 0)


export const useChart = () : [ChartModel, Dispatch<SetStateAction<ChartModel>>] => {

    const [chartModel, setChartModel] = useState<ChartModel>(
        {
           trustee: "", scheme: "", selectedFundText: "", 
           displayInPercent: true, timePeriod: "D",
           queryTimeRange: 12,
           chartLabels: [], chartDatasets: [],
           trusteeList: [], schemeList: [], fundList: []
        });


    let {loginSessionDispatch} = useAppContext();

    const mpfService: MPFService = ServiceFactory.getMPFService();


    useIonViewWillEnter(async () => {
        console.log('useChart() ionViewWillEnter event fired');
        const run = async () => {

            if (chartModel.trusteeList != null && chartModel.trusteeList.length > 0)
                return;

            const trusteeList = await mpfService.getTrustees();

            console.debug("retrieved trustees: " + trusteeList);
            setChartModel(chartModel => ({...chartModel, trusteeList: trusteeList})); 
            loginSessionDispatch({type: LoginSessionActionType.hideLoading, data: ""});

        }

        await run();
      });

    useEffect(() => {

        console.debug("useEffect() - trusteeSelected() - [" + chartModel.trustee + "]");

        const run = async () => {
            let scheme = "";

            if (stringHasValue(chartModel.trustee)) {
                // fetch trustee fund records
                const fundRecords = await mpfService.getTrustee(chartModel.trustee);
                if (!!fundRecords && fundRecords.length > 0 ) {
                    // set scheme dropdown list
                    let schemeSet =  new Set<string>();
                    fundRecords.forEach(item => {
                        schemeSet.add(item.scheme);
                    });
                    let schemeList = Array.from(schemeSet);
                
                    // set selected scheme
                    scheme = schemeList[0];

                    setChartModel(chartModel => ({...chartModel, fundRecords: fundRecords, schemeList: schemeList, scheme: scheme}));
                } else {
                    setChartModel(chartModel => ({...chartModel, fundRecords: [], schemeList: [], scheme: ""}));
                }
            }
        }

        run();

    }, [chartModel.trustee, mpfService]);

    useEffect(() => {

        console.debug("useEffect() - schemeSelected() - [" + chartModel.scheme + "]");
        
        if (stringHasValue(chartModel.scheme) && arrayHasValue(chartModel.fundRecords)) {
            let fundList = chartModel.fundRecords!.filter(item => item.scheme === chartModel.scheme).map(item => item.fund);
            console.debug("useEffect([chartModel.scheme]) - fundList = " + JSON.stringify(fundList));
            if (arrayHasValue(chartModel.schemeList)) {
                let fund = [fundList[0]];
                setChartModel(chartModel => ({...chartModel, fundList: fundList, funds: fund, selectedFundText: fundList[0]}));  
            }
        }

    }, [chartModel.scheme, chartModel.fundRecords, chartModel.schemeList]);

    useEffect(() => {

        (async() => {

        loginSessionDispatch({type: LoginSessionActionType.showLoading, data: ""});

    
        console.debug("useEffect() - fundSelected() - [" + chartModel.funds + "]");

        if (chartModel.funds && chartModel.funds.length > 0) {
    
            // setShowLoading(true);
            console.debug("fetching fund prices");

            let queryFunds = new Array<MPFFund>();
            for (let i = 0; i < chartModel.funds.length; i++) {
                queryFunds.push({trustee: chartModel.trustee, scheme: chartModel.scheme, fund: chartModel.funds[i]})
            }

            let fundPriceQuery: MPFFundPriceQuery = {
                startDate: +(moment().subtract(chartModel.queryTimeRange, "months").format("YYYYMMDD")),
                endDate: +(moment().format("YYYYMMDD")),
                timePeriod: chartModel.timePeriod,
                funds: queryFunds
            }

            let fundPriceMap = new Map<MPFFund, MPFFundPrice>();

            let retrievedFundPrices = await mpfService.getFundPrices(fundPriceQuery);

            retrievedFundPrices.forEach(item => {
                // console.debug("retrieved fund price item: " + JSON.stringify(item));
                fundPriceMap.set({trustee: item.trustee, scheme: item.scheme, fund: item.fund}, item);
            });

            setChartModel(chartModel => ({...chartModel, fundPriceMap: fundPriceMap}));
            loginSessionDispatch({type: LoginSessionActionType.hideLoading, data: ""});

        }
        })();

    }, [chartModel.funds, chartModel.timePeriod, chartModel.queryTimeRange, chartModel.scheme, chartModel.trustee, mpfService, loginSessionDispatch]);

    useEffect(() => { 

        console.debug("useEffect() selected fund price change");
        console.debug("fundPriceMap : " + chartModel.fundPriceMap?.size)
        console.debug("displayInPercent : " + chartModel.displayInPercent)

        if (!!chartModel.fundPriceMap && chartModel.fundPriceMap.size > 0) {

            console.debug(chartModel.fundPriceMap);

            let chartDatasets = new Array<ChartDataset>();
            let chartXAxisLabels = new Array<string>();
            chartModel.fundPriceMap.forEach( (fundPrice, fund) => {
                const [labels, dataset] = prepareChartData(fund, fundPrice.prices, chartModel.displayInPercent);
                chartDatasets.push(dataset);
                chartXAxisLabels = labels;
            });
            setChartModel(chartModel => ({...chartModel, chartLabels: chartXAxisLabels, chartDatasets: chartDatasets})); 
        }

    }, [chartModel.fundPriceMap, chartModel.displayInPercent]);


    const prepareChartData = (fund: MPFFund, prices: FundPrice[], inPercent: boolean): [Array<string>, ChartDataset] => {
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

   return [chartModel, setChartModel];

}