import * as firebase from 'firebase/app';
import firebaseConfig from './firebase-api.json';

export const getFirebaseInstance = () => {

    return (firebase.apps.length !== 0)? firebase.app() : firebase.initializeApp(firebaseConfig);

}

