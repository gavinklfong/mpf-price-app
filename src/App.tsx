import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, IonSplitPane, IonLoading } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { useAppContextInitialization } from './hooks/ContextHook';
import Menu from './components/Menu';
import Summary  from './pages/Summary';
import Chart from './pages/Chart';
import Login from './pages/Login';
import Investment from './pages/Investment';

import { UIStateStoreContext } from './stores/UIStateStore';

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


const App: React.FC = observer( () => {

  const uiStateStore = useContext(UIStateStoreContext);

  useAppContextInitialization();

  
  return (
      <ErrorBoundary>
      <IonApp>
        <IonReactRouter>
          <IonSplitPane contentId="main">
            <Menu />
            <IonRouterOutlet id="main">
              <RouteWithAuth path="/page/Summary" exact component={Summary} />
              <RouteWithAuth  path="/page/Chart" exact component={Chart} />
              <RouteWithAuth path="/page/Investment" exact component={Investment} />
              <Route path="/page/Login" exact component={Login} />
              <Redirect from="/" to="/page/Summary" exact />
            </IonRouterOutlet>
          </IonSplitPane>
        </IonReactRouter>
        <IonLoading
        isOpen={uiStateStore.showLoading}
        onDidDismiss={() => uiStateStore.setShowLoading(false)}
        message={'Please wait...'}
      />
      </IonApp>
      </ErrorBoundary>
  );
});

export default App;
