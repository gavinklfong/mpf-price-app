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
import React, {useState} from 'react';
import './ChartTab.css';
import ChartComponent from '../components/ChartComponent';
import { useChartTab, ChartTabForm } from '../hooks/ChartTabHook';
import Collapsible from 'react-collapsible';

// import './base/_Collapsible.scss';

const ChartTab: React.FC = () => {

 
  const [showLoading, setShowLoading] = useState(false);

  const [chartTabForm, setChartTabForm] = useState<ChartTabForm>(
   {
      trustee: "", scheme: "", fund: "", 
      displayInPercent: true, timePeriod: "D",
      queryTimeRange: 1,
      chartLabels: [], chartDatasets: [],
      trusteeList: [], schemeList: [], fundList: []
   });

  useChartTab(chartTabForm, setChartTabForm, setShowLoading);


   const handleInputChange = (e: any) => {
      console.debug(e.target.value);
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
   

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Chart</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
      <Collapsible trigger="MPF Fund Selection" open={true}>
        <IonCard>
        <IonList>
          <IonItem>
            <IonLabel>Trustee</IonLabel>
            <IonSelect interface="action-sheet" placeholder="-- Select Trustee --" 
              name="trustee"
              selectedText={chartTabForm.trustee} 
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
        </Collapsible>
        <IonCard>
            <ChartComponent type="line" labels={chartTabForm.chartLabels!} datasets={chartTabForm.chartDatasets!} /> 
        </IonCard>
      </IonContent>
      <IonLoading
        isOpen={showLoading}
        onDidDismiss={() => setShowLoading(false)}
        message={'Please wait...'}
      />
    </IonPage>
  );
};

export default ChartTab;
