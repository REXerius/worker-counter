// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const connect = () => {
  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyBeb4cCoy7368O0zBBIqL37-pwlgWhlUKY",
    authDomain: "worker-counter.firebaseapp.com",
    databaseURL:
      "https://worker-counter-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "worker-counter",
    storageBucket: "worker-counter.appspot.com",
    messagingSenderId: "601143722442",
    appId: "1:601143722442:web:523bd39d37cb61e3840f33",
    measurementId: "G-L8NR24J6S0",
  };
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  return {
    app,
    analytics,
  };
};

export default connect;
