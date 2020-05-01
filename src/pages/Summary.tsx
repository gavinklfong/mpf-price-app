import React, {useEffect, useState} from 'react';
import { IonContent, IonHeader, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonSelect, IonSelectOption, 
  IonGrid, IonRow, IonCol} from '@ionic/react';
import { useService } from '../hooks/ContextHook';
import { MPFService } from '../services/MPFService';
import SummaryTable, { Row } from '../components/SummaryTable';
import './Summary.css';


const Summary: React.FC = () => {

  const [tableRows, setTableRows] = useState<Row[]>([]);
  const mpfService: MPFService = useService("mpfService");

  useEffect(() => {
    (async () => {
      let result = await mpfService.getSummary([]);
      let rows = result.map(item => {
        let row: Row = {
          trustee: item.fund.trustee,
          fund: item.fund.fund,
          mth1: item.mth1,
          mth3: item.mth3,
          mth6: item.mth6,
          mth12: item.mth12
        }
        return row;
      });
      setTableRows(rows);
    })();

  }, [])

  return (
    <IonPage>
      <IonHeader>
      <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Summary</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
      <IonGrid>
          <IonRow>
            <IonCol>
            <IonSelect interface="action-sheet" placeholder="-- All Trustee --" 
                  name="trustee"
                  selectedText=""
                  value=""> 
              <IonSelectOption value={""}>-- All Trustee --</IonSelectOption>
              <IonSelectOption value={"HSBC"}>HSBC</IonSelectOption>
              <IonSelectOption value={"BCT"}>BCT</IonSelectOption>
            </IonSelect> 
            </IonCol>
            <IonCol>
            <IonSelect interface="action-sheet" placeholder="-- All Category --" 
                  name="category"
                  selectedText=""
                  value=""> 
              <IonSelectOption value={""}>-- All Category --</IonSelectOption>
              <IonSelectOption value={"STABLE"}>Stable Fund</IonSelectOption>
              <IonSelectOption value={"GROWTH"}>Growth Fund</IonSelectOption>
            </IonSelect>  
            </IonCol>
          </IonRow>
        </IonGrid>      
        <SummaryTable data={tableRows}/>
      </IonContent>
    </IonPage>
  );
};

export default Summary;