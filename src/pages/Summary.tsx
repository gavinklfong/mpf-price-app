import React, {useEffect, useState} from 'react';
import { IonContent, IonHeader, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonSelect, IonSelectOption, 
  IonGrid, IonRow, IonCol} from '@ionic/react';
import { useService } from '../hooks/ContextHook';
import { MPFService } from '../services/MPFService';
import SummaryTable, { Row } from '../components/SummaryTable';
import './Summary.css';


const Summary: React.FC = () => {

  const [pending, setPending] = useState(true);
  const [tableRows, setTableRows] = useState<Row[]>([]);
  const [categoryList, setCategoryList] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const mpfService: MPFService = useService("mpfService");

  useEffect(() => {
    (async () => {
      setPending(true);
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
      setPending(false);

    })();

  }, [])

  useEffect(() => {
    (async () => {
      let result = await mpfService.getCategories();
      // console.log(result);
      setCategoryList(result);
    })();
  }, []);

  useEffect(() => {

    (async () => {

      setPending(true);
      let selectedCategories = [selectedCategory];

      let result = await mpfService.getSummaryByCategories(selectedCategories);
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
      setPending(false);
    })();

  }, [selectedCategory]);

  const handleCategoryChange = (e: any) => {
    console.debug(e);
    console.debug(e.target.name);

    const {name, value} = e.target
    if (!!value && typeof value !== "undefined" && value.length > 0) {
      setSelectedCategory(value);
    }
}

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
            <IonSelect interface="action-sheet" placeholder="-- All Category --" 
                  name="category"
                  selectedText={selectedCategory}
                  value={selectedCategory}
                  onIonChange={handleCategoryChange}> 
                  > 
                <IonSelectOption value={""}>-- All Category --</IonSelectOption>
                { 
                categoryList.map(category => {
                  return (
                    <IonSelectOption key={category} value={category}>{category}</IonSelectOption>
                  )
              })}
            </IonSelect>  
            </IonCol>
          </IonRow>
        </IonGrid>      
        <SummaryTable data={tableRows} progressPending={pending}/>
      </IonContent>
    </IonPage>
  );
};

export default Summary;