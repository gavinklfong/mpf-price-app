import React from 'react';


export interface LoginSessionContextModel {
    loginId: string;
    showLoading: boolean;
}

const INITIAL_LOGIN_SESSION_CONTEXT: LoginSessionContextModel = {
    loginId: "",
    showLoading: false
}

export const initializeLoginSessionContext = (): LoginSessionContextModel => {
   
    // const authService: AuthService = serviceContext.services.get("authService");
    // let loginId = authService.getCurrentLoginId();

    return {
        loginId: "",
        showLoading: false
    }
}

export const createLoginSessionContext = () => React.createContext({
    loginSession: INITIAL_LOGIN_SESSION_CONTEXT,
    updateLoginSession: (model:LoginSessionContextModel) => {},
    // setShowLoading: (showLoading:boolean) => {}
});

export const LoginSessionContext = createLoginSessionContext();
export const LoginSessionContextProvider = LoginSessionContext.Provider;

