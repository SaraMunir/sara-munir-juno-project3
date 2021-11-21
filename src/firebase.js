import firebase from 'firebase/app';
import 'firebase/database';
import'firebase/storage';
const firebaseConfig = {
    apiKey: "AIzaSyAV2Ce5BM7k1TlB9GOEp9o9kwHOpuhJPvI",
    authDomain: "junobootcamppro3.firebaseapp.com",
    projectId: "junobootcamppro3",
    storageBucket: "junobootcamppro3.appspot.com",
    messagingSenderId: "685645620682",
    appId: "1:685645620682:web:087cfadb0f7820618d5b33"
};

firebase.initializeApp(firebaseConfig);

export default firebase;