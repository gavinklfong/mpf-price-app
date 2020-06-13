import { useState, useEffect, Dispatch, SetStateAction, useContext } from 'react';
import { autorun } from 'mobx';
import { useHistory, useLocation } from "react-router-dom";
import { AppStoreContext } from '../stores/AppStore';
import { UIStateStoreContext } from '../stores/UIStateStore';
import { ServiceFactory } from '../services/ServiceFactory';
import { AuthService } from '../services/AuthService';
import { LoginFormModel } from '../models/LoginFormModel';

export const useLogin = () : [LoginFormModel, Dispatch<SetStateAction<LoginFormModel>>, () => {}] => {

    const history = useHistory();
    const location = useLocation();
    
    const authService: AuthService = ServiceFactory.getAuthService();
    
    const [loginForm, setLoginForm] = useState<LoginFormModel>({loginId: "", password: "", alertMessage: "", showAlert: false});
  
    const uiStateStore = useContext(UIStateStoreContext);
    const appStore = useContext(AppStoreContext);

    let from: any  = location.state;
    if (from == null || from.from == null) {
      from = { from: { pathname: "/page/Summary" }  };
    } else if (from.from.pathname === "/page/Login") {
      from.from.pathname = "/page/Summary";
    }
    console.log("Login Page: from=" + JSON.stringify(from));
  
    useEffect(
      () =>
        autorun(() => {
          console.log("useEffect - autorun - appStore.loginId = " + appStore.loginId);
          if (appStore.loginId == null || appStore.loginId === "")
            return;
    
          history.push(from.from.pathname);
        }),
      [], // note empty dependencies
    )

    const submitForLogin = async () => {
  
      uiStateStore.setShowLoading(true);

      try {
        let signInResult = await authService.signInWithEmailAndPassword(loginForm.loginId, loginForm.password);
        console.log(signInResult.user.email);
        console.log("appStore.setLoginId()");
        appStore.setLoginId(signInResult.user.email);

      } catch (error) {
  
        setLoginForm((loginForm) => ({...loginForm, showAlert: true, alertMessage: "Incorrect login Id / password"}));

        await authService.signOut();
        appStore.setLoginId("");
        
        let errorCode = error.code;
        let errorMessage = error.message;
        console.log("auth - errorCode = " + errorCode);
        console.log("auth - errorMessage = " + errorMessage);


      } finally {
        uiStateStore.setShowLoading(false);
      }
    }
  return [loginForm, setLoginForm, submitForLogin];

}
