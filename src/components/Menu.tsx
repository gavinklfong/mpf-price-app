import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
  IonAvatar,
  IonChip,
  IonButton,
  IonPopover,
  IonModal,
  IonAlert
} from '@ionic/react';

import React, { useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { archiveOutline, archiveSharp, bookmarkOutline, heartOutline, heartSharp, mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, trashOutline, trashSharp, warningOutline, warningSharp } from 'ionicons/icons';
import Avatar from 'react-avatar';
import './Menu.css';

import { LoginSessionContext, LoginSessionContextModel } from '../AppContext';
import { useService, useAppContext} from '../hooks/ServiceHook';
import { AuthService } from '../services/AuthService';


interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
  needAuthentication: boolean;
}

const appPages: AppPage[] = [
  {
    title: 'Chart',
    url: '/page/Chart',
    iosIcon: mailOutline,
    mdIcon: mailSharp,
    needAuthentication: true
  },
  {
    title: 'Dashboard',
    url: '/page/Dashboard',
    iosIcon: paperPlaneOutline,
    mdIcon: paperPlaneSharp,
    needAuthentication: true
  }
];

const labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];


export interface LoginIdProps {
  loginId: string,
  isAuthenticated: boolean
}
const LoginId: React.FC<LoginIdProps> = (props) => {
  const [showAlert, setShowAlert] = useState(false);
  const authService: AuthService = useService("authService");
  const {loginSession, updateLoginSession} = useAppContext();

  const signout = async () => {
    await authService.signOut();
    updateLoginSession({...loginSession, loginId: ""});
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
          message={"Signout?"}
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

const Menu: React.FC = () => {

  const location = useLocation();

  const {loginSession, updateLoginSession} = useAppContext();
  const userEmail = loginSession.loginId

  let isAuthenticated = false;
  if (userEmail == null || userEmail.trim().length == 0) {
      isAuthenticated = false;
  } else {
      isAuthenticated = true;
  }

  console.log("Menu: isAuthenticated = " + isAuthenticated + ", userEmail = " + userEmail);
 
  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="inbox-list">
          <LoginId loginId={userEmail} isAuthenticated={isAuthenticated} />
          {appPages
          .filter(appPage => ((!appPage.needAuthentication) || (appPage.needAuthentication && isAuthenticated)))
          .map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem className={location.pathname === appPage.url ? 'selected' : ''} routerLink={appPage.url} routerDirection="none" lines="none" detail={false}>
                  <IonIcon slot="start" icon={appPage.iosIcon} />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
