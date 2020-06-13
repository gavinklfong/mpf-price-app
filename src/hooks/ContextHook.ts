
import { useEffect, Dispatch, useContext, useReducer} from 'react';
import { autorun } from 'mobx';
import { ServiceFactory } from '../services/ServiceFactory';
import { AuthService } from '../services/AuthService';
import { MPFService } from '../services/MPFService';
import { AppStoreContext } from '../stores/AppStore';

export const useAppContextInitialization = ()  => {

    const authService: AuthService = ServiceFactory.getAuthService();
    const mpfService: MPFService = ServiceFactory.getMPFService();
    
    const appStore = useContext(AppStoreContext);

    useEffect(() => {

      authService.onAuthStateChange((user:any) => {

        console.log("onAuthStateChange() - user = " + JSON.stringify(user));

        if (user != null && user.email != null) {
            appStore.setLoginId(user.email);
        }
      });
  
    }, [authService]);

    useEffect(
      () =>
        autorun(() => {
          console.log("useEffect - autorun - appStore.loginId = " + appStore.loginId);
          if (appStore.loginId != null && appStore.loginId === "") {
            mpfService.initialize(true);
          }
        }),
      [], // note empty dependencies
    )

} 