import { initializeApp } from "firebase/app";
     import { getAuth ,RecaptchaVerifier, signInWithPhoneNumber} from "firebase/auth";

     const firebaseConfig = {
      apiKey: "AIzaSyDG3OncPE7czapu_HW4Dk6wYZJZqrig3zk",
  authDomain: "battle-d3b31.firebaseapp.com",
  databaseURL: "https://battle-d3b31-default-rtdb.firebaseio.com",
  projectId: "battle-d3b31",
  storageBucket: "battle-d3b31.appspot.com",
  messagingSenderId: "504058292094",
  appId: "1:504058292094:web:4f5e7a96af7354d97fb52f",
  measurementId: "G-EXWEWC1JCP"
     };

     

const app = initializeApp(firebaseConfig);
   const auth = getAuth(app);

   export { app, auth, RecaptchaVerifier, signInWithPhoneNumber };