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
import  ChartComponent  from '../components/ChartComponent';

const ChartTab: React.FC = () => {
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
          <ChartComponent/>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default ChartTab;
