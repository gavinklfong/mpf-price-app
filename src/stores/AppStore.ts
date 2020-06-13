import { observable, action } from 'mobx';
import { createContext } from "react";


class AppStore {

    @observable
    public loginId: string = "";

    public isAuthenicated(): boolean {
        return (this.loginId === null || this.loginId == "")? false : true;
    }

    @action
    public resetLoginId() {
        this.loginId = "";
    }

    @action
    public setLoginId(loginId: string) {
        this.loginId = loginId;
    }
}


export const AppStoreContext = createContext(new AppStore());

export const AppStoreContextProvider = AppStoreContext.Provider;

