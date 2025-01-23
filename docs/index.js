// index.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, collection, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

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

// DOM Elements
const departmentSelect = document.getElementById("department-select");
const courseSelect = document.getElementById("course-select");
const majorSelect = document.getElementById("major-select");
const gradeSelect = document.getElementById("grade-select");
const strandSelect = document.getElementById("strand-select");
const gradeInputDiv = document.querySelector(".grade-input");
const strandInputDiv = document.querySelector(".strand-input");
const courseInputDiv = document.querySelector(".course-input");
const majorInputDiv = document.querySelector(".major-input");
const collegeInputDiv = document.querySelector(".college-input");

// Event listeners and functions for form handling
departmentSelect.addEventListener("change", () => {
  const selectedDepartment = departmentSelect.value;
  updateCourses(selectedDepartment);
  updateMajors(null); // Clear majors

  if (selectedDepartment === "shs") {
    gradeInputDiv.style.display = "block";
    strandInputDiv.style.display = "block";
    courseInputDiv.style.display = "none";
    majorInputDiv.style.display = "none";
    collegeInputDiv.style.display = "none"; // Hide college input for SHS
  } else {
    gradeInputDiv.style.display = "none";
    strandInputDiv.style.display = "none";
    courseInputDiv.style.display = "block";
    majorInputDiv.style.display = "block";
    collegeInputDiv.style.display = "block"; // Show college input for non-SHS
  }
});

courseSelect.addEventListener("change", () => {
  const selectedCourse = courseSelect.value;
  const selectedDepartment = departmentSelect.value;
  updateMajors(selectedCourse, selectedDepartment);
});

// Function to update courses based on selected department
function updateCourses(department) {
  return new Promise((resolve) => {
    courseSelect.innerHTML = '<option value="" disabled selected>Select Course</option>';
    if (department && departmentCourses[department]) {
      const courses = departmentCourses[department].courses;
      for (const course in courses) {
        const option = document.createElement("option");
        option.value = course;
        option.textContent = course;
        courseSelect.appendChild(option);
      }
    } else {
      console.warn(`No courses found for department: ${department}`);
    }
    resolve();
  });
}

// Function to update majors based on selected course
function updateMajors(course, department) {
  return new Promise((resolve) => {
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
      } else {
        console.warn(`No majors found for course: ${course}`);
      }
    } else {
      console.warn(`Invalid course (${course}) or department (${department}).`);
    }
    resolve();
  });
}

// Submit Form
document.querySelector(".submit").addEventListener("click", async (event) => {
  event.preventDefault();

  // Collecting general data
  const libraryIdInput = document.getElementById("library-id");
  const validUntilInput = document.getElementById("valid-until");
  
  const patron = document.querySelector(".patron select").value.trim();
  const lastName = document.querySelector(".name-inputs .data-input:nth-child(1) input").value.trim();
  const firstName = document.querySelector(".name-inputs .data-input:nth-child(2) input").value.trim();
  const middleInitial = document.querySelector(".name-inputs .data-input:nth-child(3) input").value.trim();
  const gender = document.querySelector(".gender select").value.trim();
  const department = departmentSelect.value.trim();
  const course = courseSelect.value.trim();
  const major = majorSelect.value.trim();
  const grade = gradeSelect.value.trim();
  const strand = strandSelect.value.trim();
  const schoolYear = document.querySelector(".year-sem-inputs .data-input:nth-child(1) select").value.trim();
  const semester = document.querySelector(".year-sem-inputs .data-input:nth-child(2) select").value.trim();

  const libraryIdNo = libraryIdInput.value.trim();
  const validUntil = validUntilInput.value.trim();

  // Collecting additional admin-related data
  const collegeSelect = document.querySelector(".data-input.college select").value.trim(); // Department/College
  const schoolSelect = document.getElementById("school-select").value.trim(); // School
  const specifySchoolInput = document.getElementById("specify-school-input").value.trim(); // If "Other" is selected
  const campusDept = document.querySelector(".data-input.campusdept select").value.trim(); // Campus Department

  // Prepare the data object to store in Firestore
  const userData = {
    libraryIdNo,
    validUntil,
    patron,
    lastName,
    firstName,
    middleInitial,
    gender,
    department,
    course: department === "shs" ? "" : course, // Only save course if not SHS
    major: department === "shs" ? "" : major, // Only save major if not SHS
    grade: department === "shs" ? grade : "", // Only save grade if SHS
    strand: department === "shs" ? strand : "", // Only save strand if SHS
    schoolYear,
    semester,
    timesEntered: 1, // Start timesEntered with 1
    token: generateRandomToken(),
    timestamp: new Date(), // Save the timestamp of submission
    collegeSelect, // Selected college/department
    schoolSelect, // Selected school
    specifySchool: schoolSelect === "other" ? specifySchoolInput : "", // Specify school if "Other" is selected
    campusDept, // Selected campus department
  };

  try {
    const userRef = doc(db, "LIDC_Users", libraryIdNo); // Reference to Firestore document

    // Check if the user already exists (if they do, update their document)
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      // If user already exists, increment timesEntered
      const existingData = userSnap.data();
      const updatedData = {
        ...existingData,
        timesEntered: existingData.timesEntered + 1 // Increment timesEntered
      };
      await setDoc(userRef, updatedData, { merge: true }); // merge to update only necessary fields
      alert("Welcome back! Your entry has been recorded.");
    } else {
      // If new user, create a new document
      await setDoc(userRef, userData); // Create new document
      alert("Data successfully submitted!");

      // Generate QR code for this entry and save it
      await generateQRCodeAndDownload(userData);
    }

    // Reload the page after successful submission
    window.location.reload();
  } catch (error) {
    console.error("Error storing data:", error);
    alert("An error occurred while storing the data. Please try again.");
  }
});

// Generate Random Token
function generateRandomToken() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < 16; i++) {
    token += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return token;
}

// Generate QR Code and trigger download
async function generateQRCodeAndDownload(newEntry) {
  const fullQRCodeLink = `https://enzoitan.github.io/LCC-Registration-Form-web/?libraryIdNo=${newEntry.libraryIdNo}&token=${newEntry.token}`;

  try {
    const qrDataURL = await QRCode.toDataURL(fullQRCodeLink, {
      width: 256,
      margin: 1,
    });

    // Trigger QR code download
    const link = document.createElement("a");
    link.href = qrDataURL;
    link.download = `QR_Code_LibraryID_${newEntry.libraryIdNo}.png`;
    link.click();

    // Save the QR code URL to Firestore
    const userRef = doc(db, "LIDC_Users", newEntry.libraryIdNo);
    await setDoc(
      userRef,
      { qrCodeURL: fullQRCodeLink, qrImageURL: qrDataURL },
      { merge: true }
    );
    console.log("QR code URL and image data saved to Firestore.");
  } catch (error) {
    console.error("Error generating QR code:", error);
    alert("Failed to generate QR code. Please try again.");
  }
}