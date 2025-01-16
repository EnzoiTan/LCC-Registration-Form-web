// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Firebase config object (replace with your own Firebase project settings)
const firebaseConfig = {
    apiKey: "AIzaSyCKlyckfCUI_Ooc8XiSziJ-iaKR1cbw85I",
    authDomain: "lcc-lidc.firebaseapp.com",
    databaseURL: "https://lcc-lidc-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "lcc-lidc",
    storageBucket: "lcc-lidc.firebasestorage.app",
    messagingSenderId: "934783227135",
    appId: "1:934783227135:web:4b85df00c1186c8d5fe8ca",
    measurementId: "G-S3X4YSV65S"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Export Firestore and other services if needed
export { db };
