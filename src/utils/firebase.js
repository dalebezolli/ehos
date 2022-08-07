import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, Timestamp, query, where } from 'firebase/firestore';

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
const db = getFirestore(app);
export const songsCollection = collection(db, 'saved-songs');

export const googleSignIn = async (callback) => {
  let res = localStorage.getItem('user');
  if(!res) {
    res = await signInWithPopup(auth, provider);
    localStorage.setItem('user', JSON.stringify(res.user));
  }

  callback(res.user);
}

const isSongSaved = async (songEntry, userId) => {
  let response = 0;

  await getSongs(
    query(
      songsCollection,
      where('userId', '==', userId), 
      where('youtubeId', '==', songEntry.youtubeId)
    ), 
    (queryRef) => { if(queryRef.docs?.length) response = 1; },
    (err) => { response = -1; }
  )

  return response;
}

export const addSong = async (songEntry, userId, callbackSave, callbackExists, callbackError) => {
  const songSaved = await isSongSaved(songEntry, userId);
  if(songSaved === -1) {
    if(typeof callbackError === 'function') callbackError();
    return;
  }

  if(songSaved === 1) {
    if(typeof callbackExists === 'function') callbackExists(songEntry);
    return;
  }

  songEntry.userId = userId;
  songEntry.dateAdded = Timestamp.fromDate(new Date());

  let songRef;
  try {
    songRef = await addDoc(songsCollection, songEntry);
  } catch(err) {
    console.log(`Error adding document: ${ err }`);
    if(typeof callbackError === 'function') callbackError();
    return;
  }

  if(typeof callbackSave === 'function') callbackSave(songEntry);
}

export const addSongs = async (songEntries, userId, callbackSave, callbackExists, callbackError) => {
  // TODO: CallbackSave should run on addSongs finish and not per song
  songEntries.forEach(song => {
    if(!song) return;
    addSong(song, userId, callbackSave, callbackExists, callbackError);
  });
}

export const getSongs = async (q, callbackFound, callbackError) => {
  try {
    const queryRef = await getDocs(q);
    if(typeof callbackFound === 'function') callbackFound(queryRef);
  } catch(err) {
    if(typeof callbackError === 'function') callbackError(err);
  }
}