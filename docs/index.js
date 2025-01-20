import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  getDocs,
  setDoc,
  collection,
  query,
  orderBy,
  limit,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCKlyckfCUI_Ooc8XiSziJ-iaKR1cbw85I",
  authDomain: "lcc-lidc.firebaseapp.com",
  databaseURL: "https://lcc-lidc-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "lcc-lidc",
  storageBucket: "lcc-lidc.firebasestorage.app",
  messagingSenderId: "934783227135",
  appId: "1:934783227135:web:4b85df00c1186c8d5fe8ca",
  measurementId: "G-S3X4YSV65S",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Department and courses data
const departmentCourses = {
  cics: {
    courses: {
      "BS Information System": ["None"],
      "BS Information Technology": ["None"],
    },
  },
  cte: {
    courses: {
      "Bachelor of Elementary Education": ["None"],
      "Bachelor of Technology and Livelihood Education": [
        "Home Economics",
        "Industrial Arts",
        "Information Communications Technology (ICT)",
      ],
      "Bachelor of Secondary Education": ["English", "Mathematics"],
      "Bachelor of Technical Vocational Education": [
        "Automotive Technology",
        "Civil and Construction Technology",
        "Drafting Technology",
        "Electrical Technology",
        "Electronics Technology",
        "Food and Service Management",
        "Garments, Fashion and Design",
        "Heating, Ventilation and Air Conditioning Technology",
        "Mechanical Technology",
        "Welding and Fabrication Technology",
      ],
      "Professional Education Certificate": ["None"],
    },
  },
  // (Add the rest of your departmentCourses object here)
};

// DOM Elements
const departmentSelect = document.getElementById("department-select");
const courseSelect = document.getElementById("course-select");
const majorSelect = document.getElementById("major-select");
const gradeSelect = document.getElementById("grade-select");
const strandSelect = document.getElementById("strand-select");
const gradeInputDiv = document.querySelector(".grade-input");
const courseInputDiv = document.querySelector(".course-input");
const majorInputDiv = document.querySelector(".year-input");
const strandInputDiv = document.querySelector(".strand-input");

function updateCourses(department) {
  if (!courseSelect) return; // Ensure courseSelect exists
  courseSelect.innerHTML = '<option value="" disabled selected>Select Course</option>';
  if (department && departmentCourses[department]) {
    const courses = departmentCourses[department].courses;
    for (const course in courses) {
      const option = document.createElement("option");
      option.value = course;
      option.textContent = course;
      courseSelect.appendChild(option);
    }
  }
}

function updateMajors(course, department) {
  if (!majorSelect) return; // Ensure majorSelect exists
  majorSelect.innerHTML = '<option value="" disabled selected>Select Major</option>';
  if (course && department && departmentCourses[department]) {
    const majors = departmentCourses[department].courses[course];
    if (majors) {
      majors.forEach((major) => {
        const option = document.createElement("option");
        option.value = major;
        option.textContent = major;
        majorSelect.appendChild(option);
      });
    }
  }
}

departmentSelect?.addEventListener("change", () => {
  const selectedDepartment = departmentSelect.value;
  updateCourses(selectedDepartment);
  updateMajors(null); // Clear majors

  if (selectedDepartment === "shs") {
    gradeInputDiv.style.display = "block";
    strandInputDiv.style.display = "block";
    courseInputDiv.style.display = "none";
    majorInputDiv.style.display = "none";
  } else {
    gradeInputDiv.style.display = "none";
    strandInputDiv.style.display = "none";
    courseInputDiv.style.display = "block";
    majorInputDiv.style.display = "block";
  }
});

courseSelect?.addEventListener("change", () => {
  const selectedCourse = courseSelect.value;
  const selectedDepartment = departmentSelect.value;
  updateMajors(selectedCourse, selectedDepartment);
});

// Fetch user data
async function fetchUserData(libraryId) {
  try {
    const userRef = doc(db, "LIDC_Users", libraryId);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      const userData = docSnap.data();
      displayUserData(userData);
    } else {
      console.error("No such document!");
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
}

function displayUserData(userData) {
  const userDataDiv = document.getElementById("user-data");

  if (!userDataDiv) {
    console.error("Element with ID 'user-data' not found.");
    return;
  }

  userDataDiv.innerHTML = `
    <p>Library ID: ${userData.libraryIdNo}</p>
    <p>Name: ${userData.firstName} ${userData.middleInitial} ${userData.lastName}</p>
    <p>Department: ${userData.department}</p>
    <p>Course: ${userData.course}</p>
    <p>Major: ${userData.major}</p>
    <p>Grade: ${userData.grade}</p>
    <p>Strand: ${userData.strand}</p>
    <p>School Year: ${userData.schoolYear}</p>
    <p>Semester: ${userData.semester}</p>
    <p>Valid Until: ${userData.validUntil}</p>
    <p>Token: ${userData.token}</p>
  `;


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
}

// Generate QR Code and trigger download
async function generateQRCodeAndDownload(newEntry) {
  const fullQRCodeLink = `https://enzoitan.github.io/LCC-Registration-Form-web/?libraryIdNo=${newEntry.libraryIdNo}&token=${newEntry.token}`;

  QRCode.toDataURL(fullQRCodeLink, async (err, url) => {
    if (err) {
      console.error("Error generating QR code:", err);
      return;
    }

    // Trigger the download automatically
    const link = document.createElement("a");
    link.href = url;
    link.download = `QR_Code_LibraryID_${newEntry.libraryIdNo}.png`;
    link.click();

    // Save the full QR code URL to Firestore
    try {
      // Save the full QR code link (URL) to Firestore
      const userRef = doc(db, "LIDC_Users", newEntry.libraryIdNo);
      await setDoc(userRef, { qrCodeURL: fullQRCodeLink }, { merge: true }); // Save the full QR code URL

      console.log("Full QR code URL saved to Firestore.");
    } catch (error) {
      console.error("Error saving full QR code URL to Firestore:", error);
    }
  });
}

// Handle URL parameters
const urlParams = new URLSearchParams(window.location.search);
const libraryIdNo = urlParams.get('libraryIdNo');
const token = urlParams.get('token');

if (libraryIdNo && token) {
  // Fetch student data from Firebase
  fetchUserData(libraryIdNo).then((userData) => {
    if (userData && userData.token === token) {
      document.querySelector(".name-inputs .data-input:nth-child(1) input").value = userData.lastName;
      document.querySelector(".name-inputs .data-input:nth-child(2) input").value = userData.firstName;
      document.querySelector(".name-inputs .data-input:nth-child(3) input").value = userData.middleInitial;
      document.querySelector(".gender select").value = userData.gender;
      document.getElementById("library-id").value = userData.libraryIdNo;
      document.getElementById("department-select").value = userData.department;
      updateCourses(userData.department).then(() => {
        document.getElementById("course-select").value = userData.course;
        updateMajors(userData.course, userData.department).then(() => {
          document.getElementById("major-select").value = userData.major;
        });
      });
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
  }).catch((error) => {
    console.error("Error fetching document:", error);
  });
}