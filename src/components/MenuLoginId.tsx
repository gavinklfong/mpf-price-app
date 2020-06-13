import {
  IonNote,
  IonButton,
  IonAlert
} from '@ionic/react';

import React, { useState, useContext } from 'react';
import Avatar from 'react-avatar';
import { AppStoreContext } from '../stores/AppStore';
import './MenuLoginId.css';

import { AuthService } from '../services/AuthService';
import { ServiceFactory } from '../services/ServiceFactory';


export interface LoginIdProps {
  loginId: string,
  isAuthenticated: boolean
}
const MenuLoginId: React.FC<LoginIdProps> = (props) => {
  const [showAlert, setShowAlert] = useState(false);
  const authService: AuthService = ServiceFactory.getAuthService();

  const appStore = useContext(AppStoreContext);

  const signout = async () => {
    await authService.signOut();
    appStore.resetLoginId();
  }

  return (
    <>
      <Avatar name={props.loginId} round={true} size="50" onClick={() => setShowAlert(true)} />
      { props.isAuthenticated ?
        ( 
          <>
          <IonAlert
          cssClass="signout-alert"
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          message={"Sign out?"}
          buttons={[
            {text: 'OK', role: 'OK',
             handler: () => signout()   
            }, 
             {text: 'Cancel', role: 'Cancel',
             handler: () => {
                // alert("Cancel");
             }}, ]}/>
          <IonNote>{props.loginId}</IonNote>
          </>
        )  
        : ( <IonButton size="small" href="/page/Login">Login</IonButton>

        )}

    </>
  );
}


export default MenuLoginId;
