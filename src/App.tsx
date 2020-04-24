import React, { useState } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, IonSplitPane } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { apps, flash, send, trendingUp, search } from 'ionicons/icons';

import { LoginSessionContextProvider, ServiceContextProvider, initializeServiceContext, initializeLoginSessionContext, LoginSessionContextModel}  from './AppContext';

import Menu from './components/Menu';
import Dashboard  from './pages/Dashboard';
import Chart from './pages/Chart';
import Login from './pages/Login';



/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';


const App: React.FC = () => {

  const serviceContextValue = initializeServiceContext();
  const [loginSession, updateLoginSession]= useState<LoginSessionContextModel>(initializeLoginSessionContext(serviceContextValue));
  const loginSessionContextValue = {loginSession, updateLoginSession};
  
  return (
    <ServiceContextProvider value={serviceContextValue}>
      <LoginSessionContextProvider value={loginSessionContextValue}>
      <IonApp>
        <IonReactRouter>
          <IonSplitPane contentId="main">
            <Menu />
            <IonRouterOutlet id="main">
              <Route path="/page/Dashboard" component={Dashboard} exact />
              <Route path="/page/Chart" component={Chart} exact />
              <Route path="/page/Login" component={Login} exact />
              <Redirect from="/" to="/page/Dashboard" exact />
            </IonRouterOutlet>
          </IonSplitPane>
        </IonReactRouter>
      </IonApp>
      </LoginSessionContextProvider>
    </ServiceContextProvider>
  );
};

export default App;
