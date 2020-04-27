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

import RouteWithAuth from './components/RouteWithAuth';

import ErrorBoundary from './components/ErrorBoundary';


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

  const [loginSession, updateLoginSession]= useState<LoginSessionContextModel>(initializeLoginSessionContext());
  const loginSessionContextValue = {loginSession, updateLoginSession};
  const serviceContextValue = initializeServiceContext(loginSession, updateLoginSession);

  
  return (
    <ServiceContextProvider value={serviceContextValue}>
      <LoginSessionContextProvider value={loginSessionContextValue}>
      <ErrorBoundary>
      <IonApp>
        <IonReactRouter>
          <IonSplitPane contentId="main">
            <Menu />
            <IonRouterOutlet id="main">
              <Route path="/page/Dashboard" component={RouteWithAuth(Dashboard)} exact />
              <Route path="/page/Chart" component={RouteWithAuth(Chart)} exact />
              <Route path="/page/Login" component={Login} exact />
              <Redirect from="/" to="/page/Dashboard" exact />
            </IonRouterOutlet>
          </IonSplitPane>
        </IonReactRouter>
      </IonApp>
      </ErrorBoundary>
      </LoginSessionContextProvider>
    </ServiceContextProvider>
  );
};

export default App;
