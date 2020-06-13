import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { IonAlert, IonButtons, IonMenuButton, IonContent, IonHeader, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToolbar, IonInput, IonButton } from '@ionic/react';
import { useLogin } from '../hooks/LoginHook';
import { AppStoreContext } from '../stores/AppStore';

import './Investment.css';

const Investment: React.FC = observer(() => {

  const appStore = useContext(AppStoreContext);
  
  const updateLoginId = (newLoginId: string) => {
    appStore.setLoginId(newLoginId);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>POC</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
      <IonList>
          <IonItem>
            <IonLabel>{appStore.loginId}</IonLabel>
           </IonItem>
      </IonList>
      <IonButton expand="block" onClick={e => updateLoginId("test")}>Login</IonButton>
      </IonContent>
    </IonPage>
  );
});

export default Investment;