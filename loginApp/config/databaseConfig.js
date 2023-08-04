import { firebase, initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyC5rGEtdjNNKPBdeYCZHKh6N6lx_VvJgAs",
    authDomain: "agri-auth.firebaseapp.com",
    projectId: "agri-auth",
    storageBucket: "agri-auth.appspot.com",
    messagingSenderId: "197614382593",
    appId: "1:197614382593:web:e119061c56e6d2b65ada00"
  };

if (firebase.apps.length == 0){
    firebase.initializeApp(firebaseConfig);
}

const database = getDatabase();
export default database;


