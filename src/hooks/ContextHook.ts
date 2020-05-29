
import { useEffect, Dispatch, useContext, useReducer} from 'react';
import { LoginSessionContext } from '../AppContext';
import { ServiceFactory } from '../services/ServiceFactory';
import { AuthService } from '../services/AuthService';
import { MPFService } from '../services/MPFService';
import { initializeLoginSessionContext, LoginSessionContextModel } from '../AppContext';


export const useAppContext = (): any => {
    return useContext(LoginSessionContext);
}

export enum LoginSessionActionType {
  showLoading,
  hideLoading,
  setLoginId
}
interface LoginSessionAction {
  type: LoginSessionActionType
  data: string
}
const loginSessionReducer = (state:LoginSessionContextModel, action: LoginSessionAction) => {

   const actionType = action.type;

   switch (actionType) {
     case LoginSessionActionType.showLoading:
        return {...state, showLoading:true};
     case LoginSessionActionType.hideLoading:
      return {...state, showLoading:false};
     case LoginSessionActionType.setLoginId:
      return {...state, loginId:action.data};
   }
}

export interface AppContextInitialization {
  loginSession: LoginSessionContextModel;
  loginSessionDispatch: Dispatch<LoginSessionAction>;
}
export const useAppContextInitialization = (): AppContextInitialization => {
    // const [loginSession, updateLoginSession]= useState<LoginSessionContextModel>(initializeLoginSessionContext());
    const [loginSession, loginSessionDispatch]= useReducer(loginSessionReducer, initializeLoginSessionContext());

    const authService: AuthService = ServiceFactory.getAuthService();
    const mpfService: MPFService = ServiceFactory.getMPFService();
    

    useEffect(() => {

      authService.onAuthStateChange((user:any) => {

        console.log("onAuthStateChange() - user = " + JSON.stringify(user));

        if (user != null && user.email != null)
            loginSessionDispatch({type: LoginSessionActionType.setLoginId, data: user.email});
            // updateLoginSession((loginSession:any) => ({...loginSession, loginId: user.email}));
      });
  
    }, [authService]);

    useEffect(() => {
  
        if (loginSession.loginId != null && loginSession.loginId.length > 0) {
          mpfService.initialize(true);
        }

    
      }, [loginSession.loginId, mpfService]);


    return {loginSession, loginSessionDispatch};
} 