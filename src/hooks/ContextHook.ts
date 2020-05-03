
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
    const initialServiceContext = initializeServiceContext(loginSession, updateLoginSession);
    const authService: AuthService = initialServiceContext.services.get("authService");
    const mpfService: MPFService = initialServiceContext.services.get("mpfService");

    const [serviceContext, updateServiceSession] = useState<ServiceContextModel>(initialServiceContext);


    useEffect(() => {

      authService.onAuthStateChange((user:any) => {

        console.log("onAuthStateChange() - user = " + JSON.stringify(user));

        if (user != null && user.email != null)
            updateLoginSession((loginSession:any) => ({...loginSession, loginId: user.email}));
      });
  
    }, []);

    useEffect(() => {
  
        if (loginSession.loginId != null && loginSession.loginId.length > 0) {
          mpfService.initialize();
          serviceContext.services.set("mpfService", mpfService);
          updateServiceSession(serviceContext);  
        }

    
      }, [loginSession.loginId]);


    return {loginSession, updateLoginSession, serviceContext};
} 