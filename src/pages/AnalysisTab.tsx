import React, {useEffect} from 'react';
import { IonContent, IonHeader, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import axios, {AxiosRequestConfig} from 'axios';

const AnalysisTab: React.FC = () => {

  useEffect(() => {
    // Create an scoped async function in the hook
    async function anyNameFunction() {
      let requestOptions: AxiosRequestConfig = {
        method: 'GET',
        headers : {
            "x-api-key": "Whalebig27Whalebig27",
        }
      };
      
      console.log("invoking API");
      let response = await axios.get(encodeURI("https://aifobzeuf2.execute-api.us-east-2.amazonaws.com/dev/mpf/HSBC/schemes/SuperTrust Plus/funds/North American Equity Fund/price?startDate=20190101&endDate=20200115&timePeriod=M"), requestOptions)
      console.log("result")
      console.log(JSON.stringify(response));
    }
    // Execute the created function directly
    anyNameFunction();
  }, []);

  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab Two</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem routerLink="/tab2/details">
            <IonLabel>
              <h2>Go to detail</h2>
            </IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default AnalysisTab;