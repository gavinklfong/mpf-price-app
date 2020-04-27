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
  
import React, { useContext, Component, ComponentType, ComponentClass } from 'react';
import { useLocation, Redirect, Route } from 'react-router-dom';
import { RouteProps } from 'react-router';

  
import { LoginSessionContext } from '../AppContext';
  
  
function RouteWithAuth<T>(WrappedComponent: ComponentType<T>) {

    // const location = useLocation();
            
    const {loginSession, updateLoginSession} = useContext(LoginSessionContext);
    const userEmail = loginSession.loginId

    let isAuthenticated = false;
    if (loginSession == null || loginSession.loginId == null || loginSession.loginId.trim().length == 0) {
        isAuthenticated = false;
    } else {
        isAuthenticated = true;
    }

    console.log("RouteWithAuth(): isAuthenticated = " + isAuthenticated + ", loginId = " + loginSession.loginId);

    return (props: T) => (
        <>
            (!isAuthenticated) ? (
                <Redirect to='/page/login'/>
            ) : (
                <WrappedComponent {...props} />
            )  
        </>
    )
};
  
export default RouteWithAuth;
  