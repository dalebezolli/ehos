import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { 
  getFirestore, collection, 
  Timestamp, doc, query, where,
  addDoc, getDocs, deleteDoc, updateDoc, limit, orderBy,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAKLita3dK5o4tZHcrCJf1Jx2QKkNwtAhU",
  authDomain: "ehos-live.firebaseapp.com",
  projectId: "ehos-live",
  storageBucket: "ehos-live.appspot.com",
  messagingSenderId: "9629199121",
  appId: "1:9629199121:web:9cbb05609059d6ba1b3ab0"
};

const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
const auth = getAuth();
const db = getFirestore(app);

const trackCollection = collection(db, 'saved-songs');
const tagsCollection = collection(db, 'userTags');
const logsCollection = collection(db, 'changelog');

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
    if(trackSaved.data().tags[0] !== songEntry.tags[0]) {
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

export const getTracksFromCollection = async (userId, callbackFound, callbackError) => {
  console.log('requesting saved songs');

  try {
    const queryRef = await getDocs(query(trackCollection, where('userId', '==', userId)));
    if(typeof callbackFound === 'function') callbackFound(queryRef);
  } catch(err) {
    if(typeof callbackError === 'function') callbackError(err);
  }

}

export const getUserTags = async (userId) => {
  try {
    const queryRef = await getDocs(query(tagsCollection, where('userId', '==', userId)));
    return queryRef.docs.map(doc => doc.data());
  } catch(err) {
    console.log(err);
    return null;
  }
}

const isTagCollectionSaved = async (tags) => {
  let response = 0;

  try {
    const queryRef = await getDocs(
      query(
        tagsCollection, 
        where('name', '==', tags.name),
        where('userId', '==', tags.userId))
      );
    
    if(queryRef.docs?.length) response = queryRef.docs[0];
  } catch (err) {
    console.log(err);
    response = -1;
  }

  return response;
}

export const uploadUserTags = async (tags) => {
  const tagsSaved = await isTagCollectionSaved(tags);
  let updateTags = false;

  if(tagsSaved === -1) return;
  if(tagsSaved !== 0) updateTags = true;

  try {
    let tagsRef;
    if(!updateTags) {
      tagsRef = await addDoc(tagsCollection, tags);
    } else {
      tagsRef = await updateDoc(doc(tagsCollection, tagsSaved.id), { nodes: [...tags.nodes] });
    }
  } catch(err) {
    console.log(err);
  }
}

export const getChangelog = async (lastChangelogDate) => {

  try {
    const date = (lastChangelogDate === null) ? new Date(lastChangelogDate) : new Date(2022, 9, 8);
    const timestamp = Timestamp.fromDate(date);
    const logsRef = await getDocs(query(logsCollection, orderBy('date', 'desc'), limit(1))); 
    return (logsRef.docs.length > 0 ) ? logsRef.docs[0] : null;
  } catch(err) {
    console.log(err);
    return null;
  }
}