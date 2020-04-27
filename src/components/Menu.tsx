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
  IonButton
} from '@ionic/react';

import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { archiveOutline, archiveSharp, bookmarkOutline, heartOutline, heartSharp, mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, trashOutline, trashSharp, warningOutline, warningSharp } from 'ionicons/icons';
import Avatar from 'react-avatar';
import './Menu.css';

import { LoginSessionContext } from '../AppContext';


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

const Menu: React.FC = () => {
  const location = useLocation();

  const {loginSession, updateLoginSession} = useContext(LoginSessionContext);
  const userEmail = loginSession.loginId

  let isAuthenticated = false;
  if (userEmail == null) {
      isAuthenticated = false;
  } else {
      isAuthenticated = true;
  }
 
  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="inbox-list">
          {/* <IonItem> */}
          <Avatar name={userEmail} round={true} size="50" />
          {/* </IonItem> */}
          {/* <IonListHeader>Profile</IonListHeader> */}
          { isAuthenticated 
            ? <IonNote>{userEmail}</IonNote>
            : <IonButton size="small" href="/page/Login">Login</IonButton>

          }
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
