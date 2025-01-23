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

if (libraryIdNo && token) {
  // Fetch student data from Firebase
  // Fetch student data from Firebase
fetchUserData(libraryIdNo).then((userData) => {
  if (userData && userData.token === token) {
    // Fill in the form with user data
    document.querySelector(".patron select").value = userData.patron || ""; // Patron type (Student, Faculty, etc.)
    document.querySelector(".name-inputs .data-input:nth-child(1) input").value = userData.lastName || ""; // Last Name
    document.querySelector(".name-inputs .data-input:nth-child(2) input").value = userData.firstName || ""; // First Name
    document.querySelector(".name-inputs .data-input:nth-child(3) input").value = userData.middleInitial || ""; // Middle Initial
    document.querySelector(".gender select").value = userData.gender || ""; // Gender
    document.getElementById("library-id").value = userData.libraryIdNo || ""; // Library ID
    document.getElementById("department-select").value = userData.department || ""; // Department
    document.getElementById("course-select").value = userData.course || ""; // Course
    document.getElementById("major-select").value = userData.major || ""; // Major
    document.getElementById("grade-select").value = userData.grade || ""; // Grade
    document.getElementById("strand-select").value = userData.strand || ""; // Strand
    document.getElementById("year-select").value = userData.schoolYear || ""; // School Year
    document.getElementById("semester-select").value = userData.semester || ""; // Semester

    // Additional Fields for Campus, School, and Department
    document.getElementById("school-select").value = userData.school || ""; // School
    document.getElementById("specify-school-input").value = userData.specifySchool || ""; // Specify School if 'Other'
    document.getElementById("campusdept-select").value = userData.campusDepartment || ""; // Campus Department

    // Handle fields visibility based on patron type and department
    handleFieldsBasedOnPatron(userData.patron);
    toggleFieldsBasedOnDepartment(userData.department);
  }
}).catch((error) => {
  console.error("Error fetching document:", error);
});

}

// Function to fetch user data from Firestore
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

// Function to toggle fields visibility based on department
function toggleFieldsBasedOnDepartment(department) {
  if (department === "shs") {
    document.querySelector(".course-input").style.display = "none";
    document.querySelector(".major-input").style.display = "none";
    document.querySelector(".grade-input").style.display = "block";
    document.querySelector(".strand-input").style.display = "block";
  } else {
    document.querySelector(".course-input").style.display = "block";
    document.querySelector(".major-input").style.display = "block";
    document.querySelector(".grade-input").style.display = "none";
    document.querySelector(".strand-input").style.display = "none";
  }
}

// Function to handle fields based on patron type
function handleFieldsBasedOnPatron(patronType) {
  const departmentInput = document.getElementById("department-select");
  const courseInput = document.querySelector(".course-input");
  const majorInput = document.querySelector(".major-input");
  const gradeInput = document.querySelector(".grade-input");
  const strandInput = document.querySelector(".strand-input");

  switch (patronType) {
    case "student":
      // Show course and major inputs for students
      courseInput.style.display = "block";
      majorInput.style.display = "block";
      gradeInput.style.display = "none";
      strandInput.style.display = "none";
      break;
    case "faculty":
      // Faculty: Show only department field, hide others
      departmentInput.style.display = "block";
      courseInput.style.display = "none";
      majorInput.style.display = "none";
      gradeInput.style.display = "none";
      strandInput.style.display = "none";
      break;
    case "admin":
      // Admin: Show only department field, hide others
      departmentInput.style.display = "block";
      courseInput.style.display = "none";
      majorInput.style.display = "none";
      gradeInput.style.display = "none";
      strandInput.style.display = "none";
      break;
    case "visitor":
      // Visitor: Show only department field, hide others
      departmentInput.style.display = "none"; // Hide department for visitors
      courseInput.style.display = "none";
      majorInput.style.display = "none";
      gradeInput.style.display = "none";
      strandInput.style.display = "none";
      break;
    default:
      break;
  }
}
