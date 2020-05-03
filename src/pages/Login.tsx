import React, {useEffect, useState, useContext} from 'react';
import { useHistory, useLocation } from "react-router-dom";
import { IonButtons, IonMenuButton, IonContent, IonHeader, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToolbar, IonInput, IonButton } from '@ionic/react';
import { useService, useAppContext } from '../hooks/ContextHook';
import { AuthService } from '../services/AuthService';

import './Login.css';

interface LoginForm {
  loginId: string;
  password: string;
}

const Login: React.FC = () => {


  const history = useHistory();
  const location = useLocation();
  const {loginSession, updateLoginSession} = useAppContext();
  
  const authService: AuthService = useService("authService");
  
  let initialLoginId = loginSession.loginId;
  const [loginForm, setLoginForm] = useState<LoginForm>({loginId: "gavin_fong@yahoo.com", password: "123456"});

  let from: any  = location.state;
  if (from == null || from.from == null) {
    from = { from: { pathname: "/page/Summary" }  };
  } else if (from.from.pathname == "/page/Login") {
    from.from.pathname = "/page/Summary";
  }
  console.log("Login Page: from=" + JSON.stringify(from));


  useEffect(() => {

    console.log("Login - useEffect() - loginSession.loginId = " + loginSession.loginId + ", from = " + from.from.pathname);

    if (loginSession.loginId == null || loginSession.loginId === "")
      return;

    history.push(from.from.pathname);

  }, [loginSession.loginId]);

  const submitForLogin = async () => {

    // setShowLoading(true);
    updateLoginSession((loginSession:any) => ({...loginSession, showLoading: true}));

    try {
      let signInResult = await authService.signInWithEmailAndPassword(loginForm.loginId, loginForm.password);
      console.log(signInResult.user.email);
      updateLoginSession((loginSession:any) => ({...loginSession, loginId: signInResult.user.email}));
    } catch (error) {

      await authService.signOut();
      updateLoginSession((loginSession:any) => ({...loginSession, loginId: ""}));

      let errorCode = error.code;
      let errorMessage = error.message;
      console.log("Firebase auth - errorCode = " + errorCode);
      console.log("Firebase auth - errorMessage = " + errorMessage);
    } finally {
      // setShowLoading(false);
      updateLoginSession((loginSession:any) => ({...loginSession, showLoading: false}));

    }
  }

  const handleInputChange = (e: any) => {
    // console.debug(e);
    console.debug(e.target.name);

    const {name, value} = e.target
    if (!!value && typeof value !== "undefined" && value.length > 0) {
      setLoginForm({...loginForm, [name]: value});
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
      <IonList>
          <IonItem>
            <IonLabel>Name</IonLabel>
            <IonInput value={loginForm.loginId} name="loginId" placeholder="Login Id" onIonChange={e => handleInputChange(e)}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel>Password</IonLabel>
            <IonInput type="password" name="password" value={loginForm.password} placeholder="Password" onIonChange={e => handleInputChange(e)}></IonInput>
          </IonItem>
        </IonList>
        <IonButton expand="block" onClick={e => submitForLogin()}>Login</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Login;