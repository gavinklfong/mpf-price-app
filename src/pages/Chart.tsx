import moment from 'moment';
import {
  IonCard,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSelect,
  IonSelectOption,
  IonLoading,
  IonRange,
  IonToggle,
  IonButtons,
  IonSegment,
  IonSegmentButton,
  IonMenuButton,
  useIonViewDidEnter,
  useIonViewDidLeave,
  useIonViewWillEnter,
  useIonViewWillLeave
} from '@ionic/react';
import React, { useState, Dispatch, SetStateAction } from 'react';
import './Chart.css';
import ChartComponent from '../components/ChartComponent';
import { useChart, ChartTabForm } from '../hooks/ChartHook';
import Collapsible from 'react-collapsible';
import { MPFFund } from '../services/MPFService';

// import './base/_Collapsible.scss';

const Chart: React.FC = () => {

 
  const [chartHeight, setChartHeight] = useState("50vh");

  const [chartTabForm, setChartTabForm] = useState<ChartTabForm>(
   {
      trustee: "", scheme: "", selectedFundText: "", 
      displayInPercent: true, timePeriod: "D",
      queryTimeRange: 1,
      chartLabels: [], chartDatasets: [],
      trusteeList: [], schemeList: [], fundList: []
   });


  useChart(chartTabForm, setChartTabForm);

  const handleFundSelectionChange = (e: any) => {
      console.debug(e);
      console.debug(e.target.name);

      const values: Array<any> = e.detail.value
      if (!!values && typeof values !== "undefined" && values.length > 0) {

        let selectedFundText = "Multiple Funds";
        if (values.length == 1) {
            selectedFundText = values[0];
        } else if (values.length > 1) {
            selectedFundText = "Multiple Funds";
        }
        
         setChartTabForm({...chartTabForm, funds: values, selectedFundText: selectedFundText});
      }
  
  }

   const handleInputChange = (e: any) => {
      console.debug(e);
      console.debug(e.target.name);

      const {name, value} = e.target
      if (!!value && typeof value !== "undefined" && value.length > 0) {
         setChartTabForm({...chartTabForm, [name]: value})
      }
  }

  const handleNumberInputChange = (e: any) => {
      console.debug(e.target.value);
      console.debug(e.target.name);

      const {name, value} = e.target
      if (!!value && typeof value !== "undefined") {
         let numberVal = +value;
         setChartTabForm({...chartTabForm, [name]: numberVal})
      }   
   }

   const handleToggleInputChange = (e: any) => {
      console.debug(e.target.checked);
      console.debug(e.target.name);

      const {name, checked} = e.target
      if (checked != null && typeof checked !== "undefined") {
         let booleanVal = Boolean(checked);
         setChartTabForm({...chartTabForm, [name]: checked})
      }   
   }

  const timePeriodSelected = (e: any) => {
      console.debug(e.target.value);
      console.debug(e.target.name);

      const {name, value} = e.target
      if (!!value && typeof value !== "undefined" && value.length > 0) {
         setChartTabForm({...chartTabForm, timePeriod: value})
      }   
  }
   
  const accordinOnOpen = () => {
    setChartHeight("50vh");
  }

  const accordinOnClose = () => {
    setChartHeight("75vh");
  }

  return (
    <IonPage>
      <IonHeader>
      <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Chart</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
      <Collapsible trigger="MPF Fund Selection" open={true} onOpen={accordinOnOpen} onClose={accordinOnClose}>
        <IonCard>
        <IonList>
          <IonItem>
            <IonLabel>Trustee</IonLabel>
            <IonSelect interface="action-sheet" placeholder="-- Select Trustee --" 
              name="trustee"
              selectedText={chartTabForm.trustee} 
              value={chartTabForm.trustee} 
              onIonChange={handleInputChange}> 
              {
              //  ( () => {
                // console.log(chartTabForm.trusteeList);
                  // if (chartTabForm.trusteeList != null && chartTabForm.trusteeList!.length > 0) {
                    chartTabForm.trusteeList &&
                      chartTabForm.trusteeList?.map((item: string) => {
                        return (
                          <IonSelectOption key={item} value={item}>{item}</IonSelectOption>
                        );
                      }) 
                    // } else {
                      // return "";
                    // }
                  // })()
              }
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
            <IonSelect interface="action-sheet" multiple={true} placeholder="-- Select Funds --" 
            name="fund"
            selectedText={chartTabForm.selectedFundText} value={chartTabForm.funds} 
            onIonChange={handleFundSelectionChange} >
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
            </IonItem>
            <IonItem>
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
        </Collapsible>
        <IonCard>
            <ChartComponent type="line" height={chartHeight} labels={chartTabForm.chartLabels!} datasets={chartTabForm.chartDatasets!} /> 
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Chart;
