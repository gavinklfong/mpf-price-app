import { getFirebaseInstance } from './FirebaseService';
import * as firebase from 'firebase/app';
import 'firebase/auth';

export class AuthService {

    private static instance: AuthService;

    firebase:any;

    private constructor() { 
        this.firebase = getFirebaseInstance();
    }

    static getInstance() {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }

        return AuthService.instance;
    }
    
    async signInWithEmailAndPassword(userId:string, password:string): Promise<any> {
        
        await this.signOut();

        console.log("sign in as " + userId);
        try {

            await this.firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
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

    async generateIdToken() {

        let idToken = "";
        try {
            idToken = await this.firebase.auth().currentUser.getIdToken();
        } catch (e) {
            console.error(e);
            throw e;
        }

        return idToken;
    }


}