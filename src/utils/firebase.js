import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { 
  getFirestore, collection, 
  Timestamp, doc, query, where,
  addDoc, getDocs, deleteDoc, updateDoc,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyB_na03U4uz9muOPgieFqtRkUEEng3b3l0',
  authDomain: 'ehos-musicmanager.firebaseapp.com',
  projectId: 'ehos-musicmanager',
  storageBucket: 'ehos-musicmanager.appspot.com',
  messagingSenderId: '401813384713',
  appId: '1:401813384713:web:b0dbfa35e26ba2596492d8'
};

// const firebaseConfigDev = {
//   apiKey: 'AIzaSyDyyIA78L4OSDJkG6bo1lX6AbXDJdsWmSw',
//   authDomain: 'ehos-dev.firebaseapp.com',
//   projectId: 'ehos-dev',
//   messagingSenderId: '237592290212',
//   appId: '1:237592290212:web:b103a4be58b3a235229731'
// };

const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
const auth = getAuth();
const db = getFirestore(app);
export const trackCollection = collection(db, 'saved-songs');

export const googleSignIn = async (callback) => {
  let res = localStorage.getItem('user');
  if(!res) {
    res = await signInWithPopup(auth, provider);
    localStorage.setItem('user', JSON.stringify(res.user));
  }

  callback(res.user);
}

const isTrackSavedInCollection = async (songEntry, userId) => {
  let response = 0;

  try {
    const queryRef = await getDocs(
      query(
        trackCollection, 
        where('youtubeId', '==', songEntry.youtubeId),
        where('userId', '==', userId))
      );
    
    if(queryRef.docs?.length) response = queryRef.docs[0];
  } catch (err) {
    console.log(err);
    response = -1;
  }

  return response;
}

export const saveTrackToCollection = async (songEntry, userId, callbackSave, callbackExists, callbackError) => {
  const trackSaved = await isTrackSavedInCollection(songEntry, userId);
  let updateTrack = false;
  if(trackSaved === -1) {
    if(typeof callbackError === 'function') callbackError('something went wrong');
    return;
  }

  if(trackSaved !== 0) {
    if(trackSaved.tags !== songEntry.tags) {
      updateTrack = true;
    } else {
      if(typeof callbackExists === 'function') callbackExists(songEntry);
      return;
    }
  }

  songEntry.userId = userId;
  songEntry.dateAdded = Timestamp.fromDate(new Date());

  let songRef;
  try {
    if(!updateTrack) {
      songRef = await addDoc(trackCollection, songEntry);
    } else {
      songRef = await updateDoc(doc(trackCollection, trackSaved.id), { tags: [...songEntry.tags] })
    }

  } catch(err) {
    if(typeof callbackError === 'function') callbackError(err);
    return;
  }

  if(typeof callbackSave === 'function') callbackSave(songEntry);
}

export const deleteTrackFromCollection = async (songEntry, userId, callbackSuccess, callbackError) => {
  const trackSaved = await isTrackSavedInCollection(songEntry, userId);
  
  if(trackSaved !== 0) {
    await deleteDoc(doc(trackCollection, trackSaved.id));
    console.log('deleted document');
    if(typeof callbackSuccess === 'function') callbackSuccess();
  }
}

export const getTracksFromCollection = async (uid, callbackFound, callbackError) => {
  console.log('requesting saved songs');

  try {
    const queryRef = await getDocs(query(trackCollection, where('userId', '==', uid)));
    if(typeof callbackFound === 'function') callbackFound(queryRef);
  } catch(err) {
    if(typeof callbackError === 'function') callbackError(err);
  }

}