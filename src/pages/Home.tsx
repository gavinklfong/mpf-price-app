import React, {useEffect, useState, useContext} from 'react';
import { IonContent, IonHeader, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToolbar, IonInput, IonButton } from '@ionic/react';
import Collapsible from 'react-collapsible';
import AppContext from '../AppContext';

import './Home.css';


const Home: React.FC = () => {

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");

  const serviceContext = useContext(AppContext);
  const firebaseApp = serviceContext.services.firebase;
  
  const submitForLogin = () => {
    console.log("FirebaseApp name: " + firebaseApp.name);

    firebaseApp.auth().signOut().then(function() {
      // Sign-out successful.
      console.log("signout first");

      firebaseApp.auth().signInWithEmailAndPassword(loginId, password).catch(function(error) {
        // Handle Errors here.
        let errorCode = error.code;
        let errorMessage = error.message;
        // ...
        console.log("Firebase auth - errorCode = " + errorCode);
        console.log("Firebase auth - errorMessage = " + errorMessage);
  
      });

    }).catch(function(error) {
      // An error happened.
    });



    firebaseApp.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
          console.log("login user info: " + user.uid + ", " + user.email);

          user.getIdToken(true).then((idToken) => {
              console.log("user id token: " + idToken);
          }).catch((error) => {
              console.error("Fail to generate id token");
          })


        } 
      }
    );

  }


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
      <IonList>
          <IonItem>
            <IonLabel>Name</IonLabel>
            <IonInput value={loginId} placeholder="Login Id" onIonChange={e => setLoginId(e.detail.value!)}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel>Password</IonLabel>
            <IonInput type="password" value={password} placeholder="Password" onIonChange={e => setPassword(e.detail.value!)}></IonInput>
          </IonItem>
        </IonList>
        <IonButton expand="block" onClick={e => submitForLogin()}>Login</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Home;