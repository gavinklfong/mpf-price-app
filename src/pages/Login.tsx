import React, {useEffect, useState, useContext} from 'react';
import { IonLoading, IonButtons, IonMenuButton, IonContent, IonHeader, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToolbar, IonInput, IonButton } from '@ionic/react';
import Collapsible from 'react-collapsible';
import { LoginSessionContext, ServiceContext } from '../AppContext';
import { useService } from '../hooks/ServiceHook';
import { AuthService } from '../services/AuthService';

import './Login.css';

interface LoginForm {
  loginId: string;
  password: string;
}

const Login: React.FC = () => {

  const [showLoading, setShowLoading] = useState(false);

  const {loginSession, updateLoginSession} = useContext(LoginSessionContext);
  
  const firebaseApp = useService("firebase");
  const authService: AuthService = useService("authService");
  
  let initialLoginId = loginSession.loginId;
  const [loginForm, setLoginForm] = useState<LoginForm>({loginId: initialLoginId, password: ""});


  const submitForLogin = async () => {

    setShowLoading(true);

    try {
      let signInResult = await authService.signInWithEmailAndPassword(loginForm.loginId, loginForm.password);
      console.log(signInResult.user.email);
      updateLoginSession({loginId: signInResult.user.email});

    } catch (error) {

      await authService.signOut();
      updateLoginSession({loginId: ""});

      let errorCode = error.code;
      let errorMessage = error.message;
      console.log("Firebase auth - errorCode = " + errorCode);
      console.log("Firebase auth - errorMessage = " + errorMessage);
    } finally {
      setShowLoading(false);
    }


  }

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
      <IonLoading
        isOpen={showLoading}
        onDidDismiss={() => setShowLoading(false)}
        message={'Please wait...'}
      />
    </IonPage>
  );
};

export default Login;