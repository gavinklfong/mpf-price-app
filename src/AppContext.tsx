import React, { Dispatch } from 'react';


export interface LoginSessionContextModel {
    loginId: string;
    showLoading: boolean;
}

const INITIAL_LOGIN_SESSION_CONTEXT: LoginSessionContextModel = {
    loginId: "",
    showLoading: false
}

export const initializeLoginSessionContext = (): LoginSessionContextModel => {

    return {
        loginId: "",
        showLoading: false
    }
}

export const createLoginSessionContext = () => React.createContext<{loginSession: LoginSessionContextModel; loginSessionDispatch: Dispatch<any>}>({
    loginSession: INITIAL_LOGIN_SESSION_CONTEXT,
    loginSessionDispatch: () => {},
});

export const LoginSessionContext = createLoginSessionContext();
export const LoginSessionContextProvider = LoginSessionContext.Provider;

