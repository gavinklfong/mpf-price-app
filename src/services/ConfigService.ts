
import { FirebaseService } from './FirebaseService';
import * as firebase from 'firebase/app';
import 'firebase/database';

export class ConfigService {

    private firebase: any;

    constructor(firebaseService: FirebaseService) {
        this.firebase = firebaseService.firebase;
    }

    async getProperty(key:string) {
        let snapshot = await firebase.database().ref(key).once('value');
        return (snapshot == null)? null : snapshot.val();
    }


}