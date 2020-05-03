
import { useState, useEffect, Dispatch, SetStateAction, useContext} from 'react';
import { LoginSessionContext } from '../AppContext';
import { ServiceFactory } from '../services/ServiceFactory';
import { AuthService } from '../services/AuthService';
import { MPFService } from '../services/MPFService';
import { initializeLoginSessionContext, LoginSessionContextModel } from '../AppContext';


// export const useService = (serviceKey:string): any => {


//     const serviceContext = useContext(ServiceContext);

//     return serviceContext.services.get(serviceKey);

// }


export const useAppContext = (): any => {
    return useContext(LoginSessionContext);
}


export interface AppContextInitialization {
    loginSession: LoginSessionContextModel;
    updateLoginSession: Dispatch<SetStateAction<LoginSessionContextModel>>;
}
export const useAppContextInitialization = (): AppContextInitialization => {
    const [loginSession, updateLoginSession]= useState<LoginSessionContextModel>(initializeLoginSessionContext());
    const authService: AuthService = ServiceFactory.getAuthService();
    const mpfService: MPFService = ServiceFactory.getMPFService();
    

    useEffect(() => {

      authService.onAuthStateChange((user:any) => {

        console.log("onAuthStateChange() - user = " + JSON.stringify(user));

        if (user != null && user.email != null)
            updateLoginSession((loginSession:any) => ({...loginSession, loginId: user.email}));
      });
  
    }, [authService]);

    useEffect(() => {
  
        if (loginSession.loginId != null && loginSession.loginId.length > 0) {
          mpfService.initialize(true);
          // serviceContext.services.set("mpfService", mpfService);
          // updateServiceSession(serviceContext);  
        }

    
      }, [loginSession.loginId, mpfService]);


    return {loginSession, updateLoginSession};
} 