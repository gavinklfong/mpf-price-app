import React from 'react';
import { IonContent, IonHeader, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonSelect, IonSelectOption } from '@ionic/react';
import { useSummary, ALL_CATEGORY_ITEM } from '../hooks/SummaryHook';
import SummaryTable from '../components/SummaryTable';
import './Summary.css';


const Summary: React.FC = () => {

  const [summaryPageModel, setSummaryPageModel, pending] = useSummary();

  const handleCategoryChange = (e: any) => {
    console.debug(e);
    console.debug(e.target.name);

    const {name, value} = e.target
    if (!!value && typeof value !== "undefined" && value.length > 0) {
      setSummaryPageModel({...summaryPageModel, selectedCategory: value});
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
        <IonList>
          <IonItem>
            <IonLabel>Category</IonLabel>
            <IonSelect interface="action-sheet" placeholder={ALL_CATEGORY_ITEM} 
                  name="category"
                  selectedText={summaryPageModel.selectedCategory}
                  value={summaryPageModel.selectedCategory}
                  onIonChange={handleCategoryChange}> 
                { 
                  summaryPageModel.categoryList.map(category => {
                    return (
                      <IonSelectOption key={category} value={category}>{category}</IonSelectOption>
                    )
                  })
                }
            </IonSelect>  
          </IonItem>
        </IonList>    
        <SummaryTable data={summaryPageModel.tableRows} progressPending={pending}/>
      </IonContent>
    </IonPage>
  );
};

export default Summary;