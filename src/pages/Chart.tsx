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
  IonRange,
  IonToggle,
  IonButtons,
  IonSegment,
  IonSegmentButton,
  IonMenuButton,
} from '@ionic/react';
import React, { useState } from 'react';
import ChartDiagram from '../components/ChartDiagram';
import Collapsible from 'react-collapsible';
import { useChart } from '../hooks/ChartHook';
import './Chart.css';


const Chart: React.FC = () => {

 
  const [chartHeight, setChartHeight] = useState("50vh");

  const [chartModel, setChartModel] = useChart();

  const handleFundSelectionChange = (e: any) => {
      const values: Array<any> = e.detail.value
      if (!!values && typeof values !== "undefined" && values.length > 0) {

        let selectedFundText = "Multiple Funds";
        if (values.length == 1) {
            selectedFundText = values[0];
        } else if (values.length > 1) {
            selectedFundText = "Multiple Funds";
        }
        
         setChartModel(chartModel => ({...chartModel, funds: values, selectedFundText: selectedFundText}));
      }
  
  }

   const handleInputChange = (e: any) => {
      console.debug(e);
      console.debug(e.target.name);

      const {name, value} = e.target
      if (!!value && typeof value !== "undefined" && value.length > 0) {
         setChartModel(chartModel => ({...chartModel, [name]: value}))
      }
  }

  const handleNumberInputChange = (e: any) => {
      console.debug(e.target.value);
      console.debug(e.target.name);

      const {name, value} = e.target
      if (!!value && typeof value !== "undefined") {
         let numberVal = +value;
         setChartModel(chartModel => ({...chartModel, [name]: numberVal}));
      }   
   }

   const handleToggleInputChange = (e: any) => {
      console.debug(e.target.checked);
      console.debug(e.target.name);

      const {name, checked} = e.target
      if (checked != null && typeof checked !== "undefined") {
         let booleanVal = Boolean(checked);
         setChartModel(chartModel => ({...chartModel, [name]: checked}));
      }   
   }

  const timePeriodSelected = (e: any) => {
      console.debug(e.target.value);
      console.debug(e.target.name);

      const {name, value} = e.target
      if (!!value && typeof value !== "undefined" && value.length > 0) {
         setChartModel(chartModel => ({...chartModel, timePeriod: value}));
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
              selectedText={chartModel.trustee} 
              value={chartModel.trustee} 
              onIonChange={handleInputChange}> 
              {
                chartModel.trusteeList &&
                  chartModel.trusteeList?.map((item: string) => {
                    return (
                      <IonSelectOption key={item} value={item}>{item}</IonSelectOption>
                    );
                  }) 
              }
            </IonSelect>            
          </IonItem>
          <IonItem>
            <IonLabel>Scheme</IonLabel>
            <IonSelect interface="action-sheet" placeholder="-- Select Scheme --" 
            name="scheme"
            selectedText={chartModel.scheme} value={chartModel.scheme} 
            onIonChange={handleInputChange} >
               { chartModel.schemeList!.map((item) => {
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
            selectedText={chartModel.selectedFundText} value={chartModel.funds} 
            onIonChange={handleFundSelectionChange} >
              {
                chartModel.fundList!.map(item => {
                  return (
                    <IonSelectOption key={item} value={item}>{item}</IonSelectOption>
                  );
                })
              }
            </IonSelect>
          </IonItem>  
          <IonItem>
            <IonLabel>Range</IonLabel>
            <IonRange name="queryTimeRange" value={chartModel.queryTimeRange} min={1} max={12} step={3} debounce={1000} snaps ticks color="danger"
            onIonChange={handleNumberInputChange} >
                <IonLabel slot="start">1 Month</IonLabel>
                <IonLabel slot="end">12 Months</IonLabel>
            </IonRange>
            </IonItem>
            <IonItem>
            <IonLabel>Percent</IonLabel>
            <IonToggle name="displayInPercent" checked={chartModel.displayInPercent} onIonChange={handleToggleInputChange}/>
          </IonItem>   
          <IonItem>
            <IonSegment value={chartModel.timePeriod} onIonChange={timePeriodSelected}>
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
            <ChartDiagram type="line" height={chartHeight} labels={chartModel.chartLabels!} datasets={chartModel.chartDatasets!} /> 
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Chart;
