import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuToggle,
} from '@ionic/react';

import React from 'react';
import { useLocation } from 'react-router-dom';
import { barChartOutline, barChartSharp, newspaperOutline, newspaperSharp} from 'ionicons/icons';
import './Menu.css';

import MenuLoginId from './MenuLoginId';
import { useAppContext} from '../hooks/ContextHook';


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
    iosIcon: newspaperOutline,
    mdIcon: newspaperSharp,
    needAuthentication: true
  },
  {
    title: 'Chart',
    url: '/page/Chart',
    iosIcon: barChartOutline,
    mdIcon: barChartSharp,
    needAuthentication: true
  }
];

const Menu: React.FC = () => {

  const location = useLocation();

  const {loginSession} = useAppContext();
  const userEmail = loginSession.loginId

  let isAuthenticated = false;
  if (userEmail === null || userEmail.trim().length == 0) {
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
