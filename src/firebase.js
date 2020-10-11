import firebase from "firebase/app";
import "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCv0f3IiSIyVJfioqW4UNGtcNB51SjlRhQ",
    authDomain: "remotedev-storage.firebaseapp.com",
    databaseURL: "https://remotedev-storage.firebaseio.com",
    projectId: "remotedev-storage",
    storageBucket: "remotedev-storage.appspot.com",
    messagingSenderId: "240794746246",
    appId: "1:240794746246:web:d66798ac50c79474084007",
    measurementId: "G-LGRMB84E94",
};

firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
export { storage, firebase as default };
