// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDftv3fMblRlPUg8R6DTYx9EBye3eaLFf8",
  authDomain: "collegenotes-firebase-otp.firebaseapp.com",
  projectId: "collegenotes-firebase-otp",
  storageBucket: "collegenotes-firebase-otp.appspot.com",
  messagingSenderId: "87289423653",
  appId: "1:87289423653:web:a2903cb1d5a51abe4edccc",
  measurementId: "G-W6GB5VBFFL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);