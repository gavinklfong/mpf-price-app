
import moment from 'moment';
import { Observable, of } from 'rxjs';
import { map, switchMap, startWith,tap } from 'rxjs/operators'
import React, { useState, useEffect, Dispatch, SetStateAction, useContext} from 'react';
import { LoginSessionContext, ServiceContext, ServiceContextModel } from '../AppContext';
import { AuthService } from '../services/AuthService';
import { MPFService } from '../services/MPFService';
import { initializeLoginSessionContext, initializeServiceContext, LoginSessionContextModel } from '../AppContext';


export const useService = (serviceKey:string): any => {
    const serviceContext = useContext(ServiceContext);

    return serviceContext.services.get(serviceKey);

}


export const useAppContext = (): any => {
    return useContext(LoginSessionContext);
}


export interface AppContextInitialization {
    loginSession: LoginSessionContextModel;
    updateLoginSession: Dispatch<SetStateAction<LoginSessionContextModel>>;
    serviceContext: ServiceContextModel;
}
export const useAppContextInitialization = (): AppContextInitialization => {
    const [loginSession, updateLoginSession]= useState<LoginSessionContextModel>(initializeLoginSessionContext());
    const loginSessionContextValue = {loginSession, updateLoginSession};
    const serviceContext = initializeServiceContext(loginSession, updateLoginSession);
  
    useEffect(() => {
  
      const authService: AuthService = serviceContext.services.get("authService");
      const mpfService: MPFService = serviceContext.services.get("mpfService");

  
      authService.onAuthStateChange((user:any) => {
        updateLoginSession({...loginSession, loginId: user.email})
      });
  
    }, []);

    useEffect(() => {
  
        if (loginSession.loginId == null || loginSession.loginId == "")
            return;

        const mpfService: MPFService = serviceContext.services.get("mpfService");
        mpfService.initialize();
    
      }, [loginSession.loginId]);


    return {loginSession, updateLoginSession, serviceContext};
} 