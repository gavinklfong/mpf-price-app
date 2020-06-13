import { observable, action } from 'mobx';
import { createContext } from "react";


class UIStateStore {

    @observable
    public showLoading: boolean = false;

    @action
    public setShowLoading(showLoading: boolean) {
        this.showLoading = showLoading;
    }

}


export const UIStateStoreContext = createContext(new UIStateStore());

export const UIStateStoreContextProvider = UIStateStoreContext.Provider;

