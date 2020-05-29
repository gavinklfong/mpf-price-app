import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { useHistory, useLocation } from "react-router-dom";
import { useAppContext, LoginSessionActionType } from './ContextHook';
import { ServiceFactory } from '../services/ServiceFactory';
import { AuthService } from '../services/AuthService';
import { LoginFormModel } from '../models/LoginFormModel';

export const useLogin = () : [LoginFormModel, Dispatch<SetStateAction<LoginFormModel>>, () => {}] => {

    const history = useHistory();
    const location = useLocation();
    const {loginSession, loginSessionDispatch} = useAppContext();
    
    const authService: AuthService = ServiceFactory.getAuthService();
    
    const [loginForm, setLoginForm] = useState<LoginFormModel>({loginId: "", password: "", alertMessage: "", showAlert: false});
  
    let from: any  = location.state;
    if (from == null || from.from == null) {
      from = { from: { pathname: "/page/Summary" }  };
    } else if (from.from.pathname === "/page/Login") {
      from.from.pathname = "/page/Summary";
    }
    console.log("Login Page: from=" + JSON.stringify(from));
  
  
    useEffect(() => {
  
      console.log("Login - useEffect() - loginSession.loginId = " + loginSession.loginId + ", from = " + from.from.pathname);
  
      if (loginSession.loginId == null || loginSession.loginId === "")
        return;
  
      history.push(from.from.pathname);
  
    }, [loginSession.loginId, from.from.pathname, history]);

    const submitForLogin = async () => {
  
      loginSessionDispatch({type: LoginSessionActionType.showLoading, data: ""});

      try {
        let signInResult = await authService.signInWithEmailAndPassword(loginForm.loginId, loginForm.password);
        console.log(signInResult.user.email);
        loginSessionDispatch({type: LoginSessionActionType.setLoginId, data: signInResult.user.email});

      } catch (error) {
  
        setLoginForm((loginForm) => ({...loginForm, showAlert: true, alertMessage: "Incorrect login Id / password"}));

        await authService.signOut();
        loginSessionDispatch({type: LoginSessionActionType.setLoginId, data: ""});

        
        let errorCode = error.code;
        let errorMessage = error.message;
        console.log("auth - errorCode = " + errorCode);
        console.log("auth - errorMessage = " + errorMessage);


      } finally {
        loginSessionDispatch({type: LoginSessionActionType.hideLoading, data: ""});  
      }
    }
  return [loginForm, setLoginForm, submitForLogin];

}
