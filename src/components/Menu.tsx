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
import './Menu.css';

import MenuLoginId from './MenuLoginId';
import { useService, useAppContext} from '../hooks/ContextHook';


interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
  needAuthentication: boolean;
}

const appPages: AppPage[] = [
  {
    title: 'Summary',
    url: '/page/Summary',
    iosIcon: paperPlaneOutline,
    mdIcon: paperPlaneSharp,
    needAuthentication: true
  },
  {
    title: 'Chart',
    url: '/page/Chart',
    iosIcon: mailOutline,
    mdIcon: mailSharp,
    needAuthentication: true
  }
];

const labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];


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
          <MenuLoginId loginId={userEmail} isAuthenticated={isAuthenticated} />
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
