import React, {useEffect, useState, useContext} from 'react';
import { IonLoading, IonButtons, IonMenuButton, IonContent, IonHeader, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToolbar, IonInput, IonButton } from '@ionic/react';
import Collapsible from 'react-collapsible';
import * as firebase from 'firebase/app';
import User from 'firebase/auth';
import { LoginSessionContext, ServiceContext } from '../AppContext';

import './Login.css';

interface LoginForm {
  loginId: string;
  password: string;
}

const Login: React.FC = () => {

  const [showLoading, setShowLoading] = useState(false);

  const {loginSession, updateLoginSession} = useContext(LoginSessionContext);
  const serviceContext = useContext(ServiceContext);
  
  const firebaseApp = serviceContext.services.firebase;
  
  let initialLoginId = loginSession.loginId;
  const [loginForm, setLoginForm] = useState<LoginForm>({loginId: initialLoginId, password: ""});

  const submitForLogin = () => {

    setShowLoading(true);

    console.log("FirebaseApp name: " + firebaseApp.name);

    firebaseApp.auth().signOut().then(function() {
      // Sign-out successful.
      // console.log("signout first");

      firebaseApp.auth().signInWithEmailAndPassword(loginForm.loginId, loginForm.password).then((user:any) => {

      }).catch((error:any) => {
        // Handle Errors here.
        let errorCode = error.code;
        let errorMessage = error.message;
        // ...
        console.log("Firebase auth - errorCode = " + errorCode);
        console.log("Firebase auth - errorMessage = " + errorMessage);

      }).finally(() => {
        setShowLoading(false);
      });

    }).catch((error:any) => {
      // An error happened.
    });

    firebaseApp.auth().onAuthStateChanged((user:any) => {

        if (user) {
          // User is signed in.
          console.log("login user info: " + user.uid + ", " + user.email);
          updateLoginSession({loginId: user.email});

          user.getIdToken(true).then((idToken:string) => {
              console.log("user id token: " + idToken);
          }).catch((error:any) => {
              console.error("Fail to generate id token");
          })
        } 
      });

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