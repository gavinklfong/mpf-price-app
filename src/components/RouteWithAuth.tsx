import React, {useContext } from 'react';
import { RouteProps } from 'react-router';
import { useLocation, Redirect, Route } from 'react-router-dom';
import { observer } from 'mobx-react';
import { AppStoreContext } from '../stores/AppStore';

export const RouteWithAuth: React.FC<RouteProps> = observer((props)  => {
        
    const appStore = useContext(AppStoreContext);

    const location = useLocation();

    console.log("RouteWithAuth() - isAuthenticated = " + appStore.isAuthenicated() + ", loginId = " + appStore.loginId);
    console.log("RouteWithAuth() - location = " + JSON.stringify(location));

    return (
        (!appStore.isAuthenicated()) ? (
            <Route path={props.path} exact={props.exact} >
                <Redirect to={{pathname: '/page/Login', state: { from: location }}}/>
            </Route>
        ) : (
            <Route {...props} />
        )  
    )

})

  
export default RouteWithAuth;