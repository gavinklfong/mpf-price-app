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
  IonSelectOption
} from '@ionic/react';
import { book, build, colorFill, grid } from 'ionicons/icons';
import React from 'react';
import './ChartTab.css';
import ChartComponent, { ChartDataPoint, ChartDataset }  from '../components/ChartComponent';


const randomNumber = (min:number, max:number) => Math.floor(Math.random() * (max - min + 1) + min);
const randomByte = () => randomNumber(0, 255)
const randomPercent = () => (randomNumber(50, 100) * 0.01).toFixed(2)
const randomCssRgba = () => `rgba(${[randomByte(), randomByte(), randomByte(), randomPercent()].join(',')})`

const ChartTab: React.FC = () => {

  let labels: Array<string> = ["Jan", "Feb", "March"];

  let data: Array<ChartDataPoint> = [];
  data.push({x: "Jan", y: 10});
  data.push({x: "Feb", y: 40});
  data.push({x: "March", y: 80});

  let datasets: Array<ChartDataset> = [];
  datasets.push(
    {
      label: "Sales",
      data: data,
      borderColor: randomCssRgba(),
      fill: false
    }
  );


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
            <IonSelect interface="action-sheet">
              <IonSelectOption value="HSBC">HSBC</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonLabel>Scheme</IonLabel>
            <IonSelect interface="action-sheet">
              <IonSelectOption value="TrustPlus">Trust Plus</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonLabel>Fund</IonLabel>
            <IonSelect interface="action-sheet">
              <IonSelectOption value="DSC">Default Scheme</IonSelectOption>
            </IonSelect>
          </IonItem>          
        </IonList>
        </IonCard>
        <IonCard>
          <ChartComponent type="line" labels={labels} datasets={datasets}/>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default ChartTab;
