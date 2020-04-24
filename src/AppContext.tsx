import React, { useState, Dispatch, SetStateAction } from 'react';
import * as firebase from 'firebase/app';
import 'firebase/auth'; // load authentication module

export interface ServiceContextModel {
    services: {
        firebase: any
    }
}
export interface LoginSessionContextModel {
    loginId: string;
}

const INITIAL_SRV_CONTEXT: ServiceContextModel = {
    services: {
        firebase: null
    }
}

const INITIAL_LOGIN_SESSION_CONTEXT: LoginSessionContextModel = {
    loginId: ""
}

export const initializeServiceContext = (): ServiceContextModel => {

    const firebaseConfig = {
        apiKey: "AIzaSyBDWARXfHWeDa4Yv7-Vi_YEs5p3FVZUhYM",
        authDomain: "mpf-price-app.firebaseapp.com",
        databaseURL: "https://mpf-price-app.firebaseio.com",
        projectId: "mpf-price-app",
        storageBucket: "mpf-price-app.appspot.com",
        messagingSenderId: "929922075615",
        appId: "1:929922075615:web:d13c2930402b09757f526a"
    };

    const firebaseApp = (firebase.apps.length != 0)? firebase.app() : firebase.initializeApp(firebaseConfig);

    return {
        services: {
            firebase: firebaseApp
        }
    };
}

export const initializeLoginSessionContext = (serviceContext: ServiceContextModel): LoginSessionContextModel => {
   
    const firebase = serviceContext.services.firebase;
   
    let loginId = "";
    if (firebase.auth().currentUser != null && firebase.auth().currentUser.email != null)
        loginId = firebase.auth().currentUser.email;

    return {
        loginId: loginId
    }
}

export const createServiceContext = () => React.createContext(INITIAL_SRV_CONTEXT);

export const createLoginSessionContext = () => React.createContext({
    loginSession: INITIAL_LOGIN_SESSION_CONTEXT,
    updateLoginSession: (model:LoginSessionContextModel) => {}
});

export const ServiceContext = createServiceContext();
export const LoginSessionContext = createLoginSessionContext();

export const ServiceContextProvider = ServiceContext.Provider;
export const LoginSessionContextProvider = LoginSessionContext.Provider;

// export const AppContextProvider: React.FC = (props) => {

//     const [context, setContext]= useState<AppContextModel>(initializeAppContext());
//     const contextValue = {context, setContext};

//     return (
//       <AppContext.Provider value={contextValue}>
//         {props.children}
//       </AppContext.Provider>
//     )
//   }


export default ServiceContext;