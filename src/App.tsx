import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, IonSplitPane, IonLoading } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

import { LoginSessionContextProvider }  from './AppContext';
import { useAppContextInitialization, LoginSessionActionType } from './hooks/ContextHook';

import Menu from './components/Menu';
import Summary  from './pages/Summary';
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

  const contextInitialization = useAppContextInitialization();
  const loginSessionDispatch = contextInitialization.loginSessionDispatch;
  const loginSession = contextInitialization.loginSession;
  
  return (
      <LoginSessionContextProvider value={{loginSession: loginSession, loginSessionDispatch:loginSessionDispatch}}>
      <ErrorBoundary>
      <IonApp>
        <IonReactRouter>
          <IonSplitPane contentId="main">
            <Menu />
            <IonRouterOutlet id="main">
              <RouteWithAuth path="/page/Summary" exact component={Summary} />
              <RouteWithAuth  path="/page/Chart" exact component={Chart} />
              <Route path="/page/Login" component={Login} exact />
              <Redirect from="/" to="/page/Summary" exact />
            </IonRouterOutlet>
          </IonSplitPane>
        </IonReactRouter>
        <IonLoading
        isOpen={loginSession.showLoading}
        onDidDismiss={() => loginSessionDispatch({type: LoginSessionActionType.hideLoading, data: ""})}
        message={'Please wait...'}
      />
      </IonApp>
      </ErrorBoundary>
      </LoginSessionContextProvider>
  );
};

export default App;
