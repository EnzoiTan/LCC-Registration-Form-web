// Firebase Firestore initialization (same as before)
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";

// Firebase configuration (use your existing config)
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

// Extract the libraryIdNo from the URL
const urlParams = new URLSearchParams(window.location.search);
const libraryIdNo = urlParams.get("libraryIdNo");

if (libraryIdNo) {
  fetchUserData(libraryIdNo);
} else {
  console.error("No libraryIdNo found in URL.");
}

// Fetch user data from Firestore
async function fetchUserData(libraryIdNo) {
  try {
    const userRef = doc(db, "LIDC_Users", libraryIdNo);
    const docSnapshot = await getDoc(userRef);

    if (docSnapshot.exists()) {
      const userData = docSnapshot.data();
      displayUserData(userData);
    } else {
      console.error("No such user found!");
      alert("User not found.");
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    alert("An error occurred while fetching the data. Please try again.");
  }
}

// Display the user data on the page
function displayUserData(userData) {
  // Example: Populate fields with the retrieved data
  document.getElementById("library-id").textContent = userData.libraryIdNo || "N/A";
  document.getElementById("valid-until").textContent = userData.validUntil || "N/A";
  document.getElementById("last-name").textContent = userData.lastName || "N/A";
  document.getElementById("first-name").textContent = userData.firstName || "N/A";
  document.getElementById("gender").textContent = userData.gender || "N/A";
  document.getElementById("department").textContent = userData.department || "N/A";
  document.getElementById("course").textContent = userData.course || "N/A";
  document.getElementById("major").textContent = userData.major || "N/A";
  document.getElementById("school-year").textContent = userData.schoolYear || "N/A";
  document.getElementById("semester").textContent = userData.semester || "N/A";
  document.getElementById("times-entered").textContent = userData.timesEntered || "0";
}

// Department and Courses Data
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
      "Bachelor of Technology and Livelihood Education": ["Home Economics", "Industrial Arts", "Information Communications Technology (ICT)"],
      "Bachelor of Secondary Education": ["English", "Mathematics"],
      "Bachelor of Technical Vocational Education": ["Automotive Technology", "Civil and Construction Technology", "Drafting Technology", "Electrical Technology", "Electronics Technology", "Food and Service Management", "Garments, Fashion and Design", "Heating, Ventilation and Air Conditioning Technology", "Mechanical Technology", "Welding and Fabrication Technology"],
      "Professional Education Certificate": ["None"],
    },
  },
  cet: {
    courses: {
      "BS Industrial Technology": ["Architectural Drafting Technology", "Civil Technology", "Food Technology", "Garments and Textile Technology", "Mechatronics Technology", "Power Plant Engineering Technology"],
      "BS Automotive Technology": ["None"],
      "BS Electrical Technology": ["None"],
      "BS Electronics Technology": ["None"],
      "BS Mechanical Technology": ["None"],
      "BS Refrigeration and Air Conditioning Technology": ["None"],
      "BS Computer Technology": ["None"],
      "BS Civil Engineering": ["None"],
      "Bachelor of Industrial Technology": ["Automotive Technology", "Apparel and Fashion Technology", "Architectural Drafting Technology", "Culinary Technology", "Construction Technology", "Computer Technology", "Electrical Technology", "Electronics Technology", "Heating, Ventilation and Air Conditioning Technology", "Mechanical Technology", "Mechatronics Technology", "Power Plant Technology"],
    },
  },
  sba: {
    courses: {
      "BS Entrepreneurship": ["None"],
      "BS Hospitality Management": ["None"],
    },
  },
  cme: {
    courses: {
      "BS Marine Engineering": ["None"],
    },
  },
  cpes: {
    courses: {
      "Bachelor of Physical Education": ["None"],
      "BS Exercise and Sports Sciences": ["Fitness and Sports Coaching", "Fitness and Sports Management"],
    },
  },
  ite: {
    courses: {
      "Diploma of Technology": ["Automotive Engineering Technology", "Civil Engineering Technology", "Electrical Engineering Technology", "Electronics, Communication Technology", "Food Production & Services Management Technology", "Garments, Fashion & Design Technology", "Hospitality Management Technology", "Information Technology", "Mechanical Engineering Technology"],
      "3-Year Trade Industrial Technical Education": ["Civil Technology", "Mechanical Technology", "Welding & Fabrication Technology"],
      "Associate in Industrial Technology": ["Auto Technology", "Electrical Technology", "Electronics Technology", "Food Technology", "Garments & Textile Technology", "Refrigeration and Air Conditioning Technology"],
      "2-Year Trade Technical Education Curriculum": ["Technical Drafting Technology"],
    },
  },
  shs: {
    courses: {
      "BS Development Communication": ["None"],
      "Bachelor of Fine Arts": ["None"],
      "Batsilyer ng Sining sa Filipino (BATSIFIL)": ["None"],
    },
  },
  gs: {
    courses: {
      "Doctor of Philosophy": ["Technology Management"],
      "Doctor of Education": ["Educational Administration and Supervision", "Learning and Instruction", "Curriculum Instruction"],
      "Doctor of Technology Education": ["None"],
      "Master of Arts in Teaching Vocational Education": ["Technology and Livelihood Education", "Home Economics"],
      "Master of Arts in Education": ["Educational Administration and Supervision", "Curriculum and Instructional Development", "Mathematics"],
      "Master of Technology Education": ["None"],
    },
  },
};

// DOM Elements
const departmentSelect = document.getElementById("department-select");
const courseSelect = document.getElementById("course-select");
const majorSelect = document.getElementById("major-select");
const libraryIdInput = document.getElementById("library-id");
const validUntilInput = document.getElementById("valid-until");

// Populate Courses and Majors Based on Selection
departmentSelect.addEventListener("change", () => {
  const selectedDepartment = departmentSelect.value;
  updateCourses(selectedDepartment);
  updateMajors(null); // Clear majors
});

courseSelect.addEventListener("change", () => {
  const selectedCourse = courseSelect.value;
  const selectedDepartment = departmentSelect.value;
  updateMajors(selectedCourse, selectedDepartment);
});

function updateCourses(department) {
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

// Autofill Library ID and Valid Until Date
document.addEventListener("DOMContentLoaded", async () => {
  const libraryIdInput = document.getElementById("library-id");
  const validUntilInput = document.getElementById("valid-until");

  if (!libraryIdInput || !validUntilInput) {
    console.error("One or more required DOM elements are missing.");
    return;
  }

  try {
    // Query Firestore to get the last Library ID
    const libraryIdQuery = query(
      collection(db, "LIDC_Users"),
      orderBy("libraryIdNo", "desc"),
      limit(1)
    );
    const querySnapshot = await getDocs(libraryIdQuery);
    let newId = "00001"; // Default ID if no data exists
    if (!querySnapshot.empty) {
      const lastDoc = querySnapshot.docs[0];
      const lastId = parseInt(lastDoc.data().libraryIdNo, 10);
      newId = (lastId + 1).toString().padStart(5, "0");
    }
    libraryIdInput.value = newId;
  } catch (error) {
    console.error("Error fetching Library ID:", error);
    alert("Failed to generate Library ID. Please refresh the page.");
  }

  // Set Valid Until Date
  validUntilInput.value = "July 2025";
});

// Submit Form
document.querySelector(".submit").addEventListener("click", async () => {
  const lastName = document.querySelector(".name-inputs .data-input:nth-child(1) input").value.trim();
  const firstName = document.querySelector(".name-inputs .data-input:nth-child(2) input").value.trim();
  const gender = document.querySelector(".gender select").value.trim();
  const department = departmentSelect.value.trim();
  const course = courseSelect.value.trim();
  const major = majorSelect.value.trim();
  const schoolYear = document.querySelector(".year-sem-inputs .data-input:nth-child(1) select").value.trim();
  const semester = document.querySelector(".year-sem-inputs .data-input:nth-child(2) select").value.trim();

  if (!lastName || !firstName || !gender || !department || !course || !major || !schoolYear || !semester) {
    alert("Please fill out all required fields before submitting.");
    return;
  }

  const newEntry = {
    libraryIdNo: libraryIdInput.value.trim(),
    validUntil: validUntilInput.value.trim(),
    lastName,
    firstName,
    gender,
    department,
    course,
    major,
    schoolYear,
    semester,
    timesEntered: 0,
  };

  try {
    const userRef = doc(db, "LIDC_Users", newEntry.libraryIdNo);
    await setDoc(userRef, newEntry);
    alert("Data successfully submitted!");
    generateQRCodeAndDownload(newEntry.libraryIdNo);  // Generate QR and trigger download
    window.location.reload();
  } catch (error) {
    console.error("Error storing data:", error);
    alert("An error occurred while storing the data. Please try again.");
  }
});

// Generate QR Code and trigger download
async function generateQRCodeAndDownload(libraryIdNo) {
  const qrData = `https://enzoitan.github.io/LCC-Registration-Form-web?libraryIdNo=${libraryIdNo}`;

  QRCode.toDataURL(qrData, async (err, url) => {
    if (err) {
      console.error("Error generating QR code:", err);
      return;
    }

    // Trigger the download automatically
    const link = document.createElement("a");
    link.href = url;
    link.download = `QR_Code_LibraryID_${libraryIdNo}.png`;
    link.click();

    // Save the QR code URL to Firestore
    try {
      // Save the QR code link (URL) to Firestore
      const userRef = doc(db, "LIDC_Users", libraryIdNo);
      await setDoc(userRef, { qrCodeURL: url }, { merge: true }); // Save the QR code URL

      console.log("QR code URL saved to Firestore.");
    } catch (error) {
      console.error("Error saving QR code URL to Firestore:", error);
    }
  });
}
