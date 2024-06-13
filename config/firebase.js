// Import the functions you need from the SDKs you need
const admin = require("firebase-admin");
const firebase = require('firebase');
const dotenv = require('dotenv');
dotenv.config();

const serviceAccount = process.env.FIREBASE_KEY;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCDhAqcm2RvXXzblNmRD7gJHOwKqdBaliw",
  authDomain: "heptacore-findtofine.firebaseapp.com",
  projectId: "heptacore-findtofine",
  storageBucket: "heptacore-findtofine.appspot.com",
  messagingSenderId: "149964130187",
  appId: "1:149964130187:web:bd06b290f1b8c1e018d18e"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = admin.firestore();
const auth = admin.auth();

module.exports = { db, auth, firebase };