import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Firebase configuration
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
const db = getFirestore(app);

// Handle URL parameters
const urlParams = new URLSearchParams(window.location.search);
const libraryIdNo = urlParams.get('libraryIdNo');
const token = urlParams.get('token');

if (userData && userData.token === token) {
  document.querySelector(".name-inputs .data-input:nth-child(1) input").value = userData.lastName;
  document.querySelector(".name-inputs .data-input:nth-child(2) input").value = userData.firstName;
  document.querySelector(".name-inputs .data-input:nth-child(3) input").value = userData.middleInitial;
  document.querySelector(".gender select").value = userData.gender;
  document.getElementById("department-select").value = userData.department;
  document.getElementById("course-select").value = userData.course;
  document.getElementById("major-select").value = userData.major;
  document.getElementById("grade-select").value = userData.grade;
  document.getElementById("strand-select").value = userData.strand;
  document.getElementById("year-select").value = userData.schoolYear;
  document.getElementById("semester-select").value = userData.semester;

  // Hide or show fields based on department
  if (userData.department === "shs") {
    document.querySelector(".course-input").style.display = "none";
    document.querySelector(".year-input").style.display = "none";
    document.querySelector(".grade-input").style.display = "block";
    document.querySelector(".strand-input").style.display = "block";
  } else {
    document.querySelector(".course-input").style.display = "block";
    document.querySelector(".year-input").style.display = "block";
    document.querySelector(".grade-input").style.display = "none";
    document.querySelector(".strand-input").style.display = "none";
  }
} else {
  alert("Invalid token.");
}

async function fetchUserData(libraryId) {
  try {
    // Reference to the user document in Firestore
    const userRef = doc(db, "LIDC_Users", libraryId);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      // Get data from the document
      const userData = docSnap.data();
      console.log("User data fetched: ", userData);
      return userData;
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user data: ", error);
    return null;
  }
}