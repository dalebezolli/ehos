import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithCredential } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyB_na03U4uz9muOPgieFqtRkUEEng3b3l0',
  authDomain: 'ehos-musicmanager.firebaseapp.com',
  projectId: 'ehos-musicmanager',
  storageBucket: 'ehos-musicmanager.appspot.com',
  messagingSenderId: '401813384713',
  appId: '1:401813384713:web:b0dbfa35e26ba2596492d8'
};

const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
const auth = getAuth();

export const googleSignIn = async (callback) => {
  let res = localStorage.getItem('user');
  if(!res) {
    res = await signInWithPopup(auth, provider);
    localStorage.setItem('user', JSON.stringify(res.user));
  }

  callback(res.user);
}