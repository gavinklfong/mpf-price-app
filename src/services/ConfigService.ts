
import { getFirebaseInstance } from './FirebaseService';
import * as firebase from 'firebase/app';
import 'firebase/database';

export class ConfigService {

    private static instance: ConfigService;

    private firebase: any;

    static getInstance(): ConfigService {
        if (!ConfigService.instance) {
            ConfigService.instance = new ConfigService();
        }

        return ConfigService.instance;
    }

    private constructor() { 
        this.firebase = getFirebaseInstance();
    }

    async getProperty(key:string) {
        let snapshot = await this.firebase.database().ref(key).once('value');
        return (snapshot == null)? null : snapshot.val();
    }


}