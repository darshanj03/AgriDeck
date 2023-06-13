import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyC5rGEtdjNNKPBdeYCZHKh6N6lx_VvJgAs",
    authDomain: "agri-auth.firebaseapp.com",
    projectId: "agri-auth",
    storageBucket: "agri-auth.appspot.com",
    messagingSenderId: "197614382593",
    appId: "1:197614382593:web:e119061c56e6d2b65ada00"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;


