import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {

  apiKey: "AIzaSyBi1TJ6fyuAD2-YRslK-Ae1aXkeMBAhGwk",

  authDomain: "violence-qatar2022.firebaseapp.com",

  projectId: "violence-qatar2022",

  storageBucket: "violence-qatar2022.appspot.com",

  messagingSenderId: "149623224806",

  appId: "1:149623224806:web:ee7836f4d3408640857e27"

};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

