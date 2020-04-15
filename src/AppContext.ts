import React from 'react';
import * as firebase from 'firebase/app';
import 'firebase/auth'; // load authentication module



let firebaseConfig = {
    apiKey: "AIzaSyBDWARXfHWeDa4Yv7-Vi_YEs5p3FVZUhYM",
    authDomain: "mpf-price-app.firebaseapp.com",
    databaseURL: "https://mpf-price-app.firebaseio.com",
    projectId: "mpf-price-app",
    storageBucket: "mpf-price-app.appspot.com",
    messagingSenderId: "929922075615",
    appId: "1:929922075615:web:d13c2930402b09757f526a"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

export const serviceContext = {
    services: {
        firebase: firebaseApp
    }
};


const AppContext = React.createContext(serviceContext);

export const AppContextProvider = AppContext.Provider;
export const AppContextConsumer = AppContext.Consumer;

export default AppContext;