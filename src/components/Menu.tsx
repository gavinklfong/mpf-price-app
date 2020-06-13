import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuToggle,
} from '@ionic/react';

import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { barChartOutline, barChartSharp, newspaperOutline, newspaperSharp, baseballOutline, baseballSharp} from 'ionicons/icons';
import './Menu.css';

import MenuLoginId from './MenuLoginId';
import { observer } from 'mobx-react';
import { AppStoreContext } from '../stores/AppStore';



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
  },
  {
    title: 'Investment',
    url: '/page/Investment',
    iosIcon: baseballOutline,
    mdIcon: baseballSharp,
    needAuthentication: true
  }
];

const Menu: React.FC = observer(() => {

  const location = useLocation();

  const appStore = useContext(AppStoreContext);

  const userEmail = appStore.loginId;

  console.log("Menu: isAuthenticated = " + appStore.isAuthenicated() + ", userEmail = " + userEmail);
 
  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="inbox-list">
          <MenuLoginId loginId={userEmail} isAuthenticated={appStore.isAuthenicated()} />
          {appPages
          .filter(appPage => ((!appPage.needAuthentication) || (appPage.needAuthentication && appStore.isAuthenicated())))
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
});

export default Menu;
