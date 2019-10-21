import * as firebase from 'firebase';
import {firebaseConfig} from './config';
//copy firebaseConfig from firebase website

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const databaseRef = firebase.database().ref();
export const earthLocRef = databaseRef.child('earthlocations');