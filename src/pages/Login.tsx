import React from 'react';
import { IonAlert, IonButtons, IonMenuButton, IonContent, IonHeader, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToolbar, IonInput, IonButton } from '@ionic/react';
import { useLogin } from '../hooks/LoginHook';

import './Login.css';

const Login: React.FC = () => {

  const [loginForm, setLoginForm, submitForLogin] = useLogin();

  const handleInputChange = (e: any) => {
    // console.debug(e);
    console.debug(e.target.name);

    const {name, value} = e.target
    if (!!value && typeof value !== "undefined" && value.length > 0) {
      setLoginForm({...loginForm, [name]: value});
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
      <IonList>
          <IonItem>
            <IonLabel>Name</IonLabel>
            <IonInput value={loginForm.loginId} name="loginId" placeholder="Login Id" onIonChange={e => handleInputChange(e)}></IonInput>
            </IonItem>
          <IonItem>
            <IonLabel>Password</IonLabel>         
            <IonInput type="password" name="password" value={loginForm.password} placeholder="Password" onIonChange={e => handleInputChange(e)}></IonInput>
          </IonItem>
      </IonList>
      <IonButton expand="block" onClick={e => submitForLogin()}>Login</IonButton>
      </IonContent>
      <IonAlert
          isOpen={loginForm.showAlert}
          onDidDismiss={() => { setLoginForm((loginForm) => ({...loginForm, showAlert: false, alertMessage: ""})) }}
          header={'Alert'}
          message={loginForm.alertMessage}
          buttons={['OK']}
        />
    </IonPage>
  );
};

export default Login;