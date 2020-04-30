import * as firebase from 'firebase/app';

const FIREBASE_CONFIG = {
    apiKey: "AIzaSyBDWARXfHWeDa4Yv7-Vi_YEs5p3FVZUhYM",
    authDomain: "mpf-price-app.firebaseapp.com",
    databaseURL: "https://mpf-price-app.firebaseio.com",
    projectId: "mpf-price-app",
    storageBucket: "mpf-price-app.appspot.com",
    messagingSenderId: "929922075615",
    appId: "1:929922075615:web:d13c2930402b09757f526a"
};

export class FirebaseService {

    firebase: any;

    constructor() {
        this.firebase  = (firebase.apps.length != 0)? firebase.app() : firebase.initializeApp(FIREBASE_CONFIG);
    }

}

