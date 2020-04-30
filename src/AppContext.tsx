import React, { useState, Dispatch, SetStateAction } from 'react';
import { AuthService } from './services/AuthService';
import { MPFService } from './services/MPFService';
import { ConfigService } from './services/ConfigService';
import { FirebaseService } from './services/FirebaseService';


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

export const initializeServiceContext = (loginSession: LoginSessionContextModel, updateLoginSession: Dispatch<SetStateAction<LoginSessionContextModel>>): ServiceContextModel => {

    const serviceMap = new Map<string, any>();

    const firebaseService = new FirebaseService();

    const configService = new ConfigService(firebaseService);
    const authService = new AuthService(firebaseService);
    const mpfService = new MPFService(authService, configService);

    serviceMap.set("authService", authService);
    serviceMap.set("mpfService", mpfService);

    return {
        services: serviceMap
    };
}

export const initializeLoginSessionContext = (): LoginSessionContextModel => {
   
    // const authService: AuthService = serviceContext.services.get("authService");
   
    // let loginId = authService.getCurrentLoginId();

    return {
        loginId: ""
        
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


export default ServiceContext;