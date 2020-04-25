import React, { useState, Dispatch, SetStateAction } from 'react';
import { AuthService } from './services/AuthService';
// import * as firebase from 'firebase/app';


export interface ServiceContextModel {
    services: Map<string, any>
}
export interface LoginSessionContextModel {
    loginId: string;
}

const INITIAL_SRV_CONTEXT: ServiceContextModel = {
    services: new Map<string, any>()
}

const INITIAL_LOGIN_SESSION_CONTEXT: LoginSessionContextModel = {
    loginId: ""
}

export const initializeServiceContext = (): ServiceContextModel => {

    const serviceMap = new Map<string, any>();

    const authService = new AuthService();

    serviceMap.set("authService", authService);

    return {
        services: serviceMap
    };
}

export const initializeLoginSessionContext = (serviceContext: ServiceContextModel): LoginSessionContextModel => {
   
    const authService: AuthService = serviceContext.services.get("authService");
   
    let loginId = authService.getCurrentLoginId();

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