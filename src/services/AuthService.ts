import * as firebase from 'firebase/app';
import 'firebase/auth';


export class AuthService {

    firebase:any;

    firebaseConfig = {
        apiKey: "AIzaSyBDWARXfHWeDa4Yv7-Vi_YEs5p3FVZUhYM",
        authDomain: "mpf-price-app.firebaseapp.com",
        databaseURL: "https://mpf-price-app.firebaseio.com",
        projectId: "mpf-price-app",
        storageBucket: "mpf-price-app.appspot.com",
        messagingSenderId: "929922075615",
        appId: "1:929922075615:web:d13c2930402b09757f526a"
    };


    constructor() {
        this.firebase  = (firebase.apps.length != 0)? firebase.app() : firebase.initializeApp(this.firebaseConfig);
    }
    

    async signInWithEmailAndPassword(userId:string, password:string): Promise<any> {
        console.log("sign out");
        await this.signOut();

        console.log("sign in as " + userId);
        try {
            return await this.firebase.auth().signInWithEmailAndPassword(userId, password);
        } catch (e) {
            console.log(e);
            throw e;
        }

    }

    async signOut() {
        await this.firebase.auth().signOut();
    }

    getCurrentLoginId():string  {
        if (this.firebase.auth().currentUser != null && this.firebase.auth().currentUser.email != null)
            return this.firebase.auth().currentUser.email;
        else 
            return "";
    }

    onAuthStateChange(handleAuthStateChange:any) {
        this.firebase.auth().onAuthStateChanged(handleAuthStateChange);
    }


}