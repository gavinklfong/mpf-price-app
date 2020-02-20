import moment from 'moment';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSelect,
  IonSelectOption,
  IonLoading,
  IonRange,
  IonToggle,
  IonNote,
  IonSpinner,
  IonSegment,
  IonSegmentButton
} from '@ionic/react';
import { loadingController } from '@ionic/core';
import { book, build, colorFill, grid } from 'ionicons/icons';
import React, { useEffect, useLayoutEffect, useState, useRef} from 'react';
import './ChartTab.css';
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

// let loading: HTMLIonLoadingElement;
// ( async () => {
//    loading = await loadingController.create({
//       message: 'Loading...',
//       });
// })();

const ChartTab: React.FC = () => {

   const [chartTabForm, setChartTabForm] = useState<ChartTabForm>(
      {
         trustee: "", scheme: "", fund: "", 
         displayInPercent: true, timePeriod: "D",
         queryTimeRange: 1,
         chartLabels: [], chartDatasets: [],
         trusteeList: [], schemeList: [], fundList: []
      });

  const [showLoading, setShowLoading] = useState(false);

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

   const handleInputChange = (e: any) => {
      console.log(e.target.value);
      console.log(e.target.name);

      const {name, value} = e.target
      if (!!value && typeof value !== "undefined" && value.length > 0) {
         setChartTabForm({...chartTabForm, [name]: value})
      }
  }

  const handleNumberInputChange = (e: any) => {
      console.log(e.target.value);
      console.log(e.target.name);

      const {name, value} = e.target
      if (!!value && typeof value !== "undefined") {
         let numberVal = +value;
         setChartTabForm({...chartTabForm, [name]: numberVal})
      }   
   }

   const handleToggleInputChange = (e: any) => {
      console.log(e.target.checked);
      console.log(e.target.name);

      const {name, checked} = e.target
      if (checked != null && typeof checked !== "undefined") {
         let booleanVal = Boolean(checked);
         setChartTabForm({...chartTabForm, [name]: checked})
      }   
   }

  const timePeriodSelected = (e: any) => {
      console.log(e.target.value);
      console.log(e.target.name);

      const {name, value} = e.target
      if (!!value && typeof value !== "undefined" && value.length > 0) {
         setChartTabForm({...chartTabForm, timePeriod: value})
      }   
  }


  const trusteeSelected = async (trustee: string) => {
      console.log("trusteeSelected() - " + trustee);
      if (!!trustee && typeof trustee !== "undefined") {
         setChartTabForm({...chartTabForm, trustee: trustee});
      }

  }

  useEffect(() => {

      (async () => {
         console.log("useEffect() - trusteeSelected() - " + chartTabForm.trustee);

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

  const schemeSelected = (scheme: string) => {
      console.log("schemeSelected() - " + scheme);
      console.log("schemeSelected() - trustee: " + chartTabForm.trustee);

      if (!!scheme && typeof scheme !== "undefined" && scheme.length > 0) {
         setChartTabForm({...chartTabForm, scheme: scheme});
      }// // set selected fund
  }

  useEffect(() => {

   (async () => {
      console.log("useEffect() - schemeSelected() - " + chartTabForm.scheme);
      
      let fund = "";

      if (!!chartTabForm.scheme && chartTabForm.scheme.length > 0 &&
         !!chartTabForm.fundRecords && chartTabForm.fundRecords.length > 0) {
         chartTabForm.fundList = chartTabForm.fundRecords.filter(item => item.scheme === chartTabForm.scheme).map(item => item.fund);
         if (!!chartTabForm.schemeList && chartTabForm.schemeList.length > 0) {
            fund = chartTabForm.fundList[0];
         }

         // // fetch fund prices
         // let fundPriceQuery: MPFFundPriceQuery = 
         // {  trustee: chartTabForm.trustee, scheme: chartTabForm.scheme, fund: fund,
         //    startDate: +(moment().subtract(chartTabForm.queryTimeRange, "months").format("YYYYMMDD")),
         //    endDate: +(moment().format("YYYYMMDD")),
         //    timePeriod: chartTabForm.timePeriod }

         // let fundPrices = await mpfService.getFundPrices(fundPriceQuery);

         setChartTabForm({...chartTabForm, fund: fund});  
      }

   })()

   }, [chartTabForm.scheme]);

  const fundSelected =  (fund: string) => {
     if (!!fund && typeof fund !== "undefined" && fund.length > 0) {
      setChartTabForm({...chartTabForm, fund: fund});
     }
  }

  useEffect(() => {

   ( async () => {

      console.log("useEffect() - fundSelected() - " + chartTabForm.fund);

      if (!!chartTabForm.fund && typeof chartTabForm.fund !== "undefined" && chartTabForm.fund.length > 0) {
     
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

  const queryTimeRangeSelected = (range: number) => {
      setChartTabForm({...chartTabForm, queryTimeRange: range});
  }

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
   

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Chart</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonCard>
        <IonList>
          <IonItem>
            <IonLabel>Trustee</IonLabel>
            <IonSelect interface="action-sheet" placeholder="-- Select Trustee --" 
              name="trustee"
              value={chartTabForm.trustee} 
              onIonChange={handleInputChange}> 
              { chartTabForm.trusteeList!.map((item: string) => {
                return (
                  <IonSelectOption key={item} value={item}>{item}</IonSelectOption>
                );
              })}
            </IonSelect>            
          </IonItem>
          <IonItem>
            <IonLabel>Scheme</IonLabel>
            <IonSelect interface="action-sheet" placeholder="-- Select Scheme --" 
            name="scheme"
            selectedText={chartTabForm.scheme} value={chartTabForm.scheme} 
            onIonChange={handleInputChange} >
               { chartTabForm.schemeList!.map((item) => {
                  return (
                    <IonSelectOption key={item} value={item}>{item}</IonSelectOption>
                  );
               })}               
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonLabel>Fund</IonLabel>
            <IonSelect interface="action-sheet" placeholder="-- All Funds --" 
            name="fund"
            selectedText={chartTabForm.fund} value={chartTabForm.fund} 
            onIonChange={handleInputChange} >
              { chartTabForm.fundList!.map((item: string) => {
                return (
                  <IonSelectOption key={item} value={item}>{item}</IonSelectOption>
                );
              })}
            </IonSelect>
          </IonItem>  
          <IonItem>
            <IonLabel>Range</IonLabel>
            <IonRange name="queryTimeRange" value={chartTabForm.queryTimeRange} min={1} max={12} step={3} debounce={1000} snaps ticks color="danger"
            onIonChange={handleNumberInputChange} >
                <IonLabel slot="start">1 Month</IonLabel>
                <IonLabel slot="end">12 Months</IonLabel>
            </IonRange>
            <IonLabel>Percent</IonLabel>
            <IonToggle name="displayInPercent" checked={chartTabForm.displayInPercent} onIonChange={handleToggleInputChange}/>
          </IonItem>   
          <IonItem>
            <IonSegment value={chartTabForm.timePeriod} onIonChange={timePeriodSelected}>
               <IonSegmentButton value="D">
               <IonLabel>Daily</IonLabel>
               </IonSegmentButton>
               <IonSegmentButton value="W">
               <IonLabel>Weekly</IonLabel>
               </IonSegmentButton>
               <IonSegmentButton value="M">
               <IonLabel>Monthly</IonLabel>
               </IonSegmentButton>
            </IonSegment>
          </IonItem>     
        </IonList>
        </IonCard>
        <IonCard>
            <ChartComponent type="line" labels={chartTabForm.chartLabels!} datasets={chartTabForm.chartDatasets!} /> 
        </IonCard>

      </IonContent>
    </IonPage>
  );
};

export default ChartTab;
