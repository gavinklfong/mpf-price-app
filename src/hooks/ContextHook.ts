
import React, { useState, useEffect, Dispatch, SetStateAction, useContext} from 'react';
import { LoginSessionContext, ServiceContext, ServiceContextModel } from '../AppContext';
import { useHistory, useLocation } from "react-router-dom";
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
  
    // const history = useHistory();

    useEffect(() => {
  
      const authService: AuthService = serviceContext.services.get("authService");
      const mpfService: MPFService = serviceContext.services.get("mpfService");
  
      authService.onAuthStateChange((user:any) => {

        if (user == null || user.email == null)
          return;

        updateLoginSession({...loginSession, loginId: user.email});
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