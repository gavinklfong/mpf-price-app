import React, { Component, ReactNode, ComponentType, useContext } from 'react';
import { RouteProps } from 'react-router';
import { useLocation, Redirect, Route } from 'react-router-dom';
import { LoginSessionContext } from '../AppContext';

export const RouteWithAuth: React.FC<RouteProps> = (props)  => {
        
    const {loginSession, updateLoginSession} = useContext(LoginSessionContext);
    const userEmail = loginSession.loginId

    const location = useLocation();

    let isAuthenticated = false;
    if (loginSession == null || loginSession.loginId == null || loginSession.loginId.trim().length == 0) {
        isAuthenticated = false;
    } else {
        isAuthenticated = true;
    }

    console.log("RouteWithAuth() - isAuthenticated = " + isAuthenticated + ", loginId = " + loginSession.loginId);
    console.log("RouteWithAuth() - location = " + JSON.stringify(location));

    return (
        (!isAuthenticated) ? (
            <Route path={props.path} exact={props.exact} >
                <Redirect to={{pathname: '/page/Login', state: { from: location }}}/>
            </Route>
        ) : (
            <Route {...props} />
        )  
    )

}

  
export default RouteWithAuth;