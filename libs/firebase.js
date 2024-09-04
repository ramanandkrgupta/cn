import { initializeApp } from "firebase/app";
     import { getAuth ,RecaptchaVerifier, signInWithPhoneNumber} from "firebase/auth";

     const firebaseConfig = {
      apiKey: "AIzaSyDftv3fMblRlPUg8R6DTYx9EBye3eaLFf8",
      authDomain: "collegenotes-firebase-otp.firebaseapp.com",
      projectId: "collegenotes-firebase-otp",
      storageBucket: "collegenotes-firebase-otp.appspot.com",
      messagingSenderId: "87289423653",
      appId: "1:87289423653:web:a2903cb1d5a51abe4edccc",
      measurementId: "G-W6GB5VBFFL"
     };

     

const app = initializeApp(firebaseConfig);
   const auth = getAuth(app);

   export { app, auth, RecaptchaVerifier, signInWithPhoneNumber };