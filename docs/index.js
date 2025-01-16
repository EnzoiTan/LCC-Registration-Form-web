// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDocs, collection, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

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

// Department and Courses Data
const departmentCourses = {
  cics: {
    courses: {
      "BS Computer Science": ["None"],
      "BS Information Technology": ["None"],
    },
  },
  cte: {
    courses: {
      "Bachelor of Elementary Education": [
        "None",
      ],
      "Bachelor of Technology and Livelihood Education": [
        "Home Economics",
        "Industrial Arts",
        "Information Communications Technology (ICT)",
      ],
      "Bachelor of Secondary Education": [
        "English",
        "Mathematics",
      ],
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

      "Professional Education Certificate": [
        "None",
      ],
    },
  },
  cet: {
    courses: {
        "BS Industrial Technology": [
        "Architectural Drafting Technology",
        "Civil Technology",
        "Food Technology",
        "Garments and Textile Technology",
        "Mechatronics Technology",
        "Power Plant Engineering Technology",
      ],
      "BS Automotive Technology": [
        "None",
      ],
      "BS Electrical Technology": [
        "None",
      ],
      "BS Electronics Technology": [
        "None",
      ],
      "BS Mechanical Technology": [
        "None",
      ],
      "BS Refrigeration and Air Conditioning Technology": [
        "None",
      ],
      "BS Computer Technology": [
        "None",
      ],
      "BS Civil Engineering": [
        "None",
      ],
      "Bachelor of Industrial Technology": [
        "Automotive Technology",
        "Apparel and Fashion Technology",
        "Architectural Drafting Technology",
        "Culinary Technology",
        "Construction Technology",
        "Computer Technology",
        "Electrical Technology",
        "Electronics Technology",
        "Heating, Ventilation and Air Conditioning Technology",
        "Mechanical Technology",
        "Mechatronics Technology",
        "Power Plant Technology",
      ],
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
        "Diploma of Technology": [
          "Automotive Engineering Technology",
          "Civil Engineering Technology",
          "Electrical Engineering Technology",
          "Electronics, Communication Technology",
          "Food Production & Services Management Technology",
          "Garments, Fashion & Design Technology",
          "Hospitality Management Technology",
          "Information Technology",
          "Mechanical Engineering Technology",
        ],
        "3-Year Trade Industrial Technical Education": [
          "Civil Technology",
          "Mechanical Technology",
          "Welding & Fabrication Technology",
        ],
        "Associate in Industrial Technology": [
          "Auto Technology",
          "Electrical Technology",
          "Electronics Technology",
          "Food Technology",
          "Garments & Textile Technology",
          "Refrigeration and Air Conditioning Technology",
        ],
        "2-Year Trade Technical Education Curriculum": [
          "Technical Drafting Technology",
        ],
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
      "BDoctor of Education": [
        "Educational Administration and Supervision",
        "Learning and Instruction",
        "Curriculum Instruction",
      ],
      "Doctor of Technology Education": ["None"],
      "Master of Arts in Teaching Vocational Education": [
        "Technology and Livelihood Education",
        "Home Economics",
      ],
      "Master of Arts in Education": [
        "Educational Administration and Supervision",
        "Curriculum and Instructional Development",
        "Mathematics",
      ],
      "Master of Technology Education": [
        "None",
      ],
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
    generateQRCode(newEntry.libraryIdNo);
    window.location.reload();
  } catch (error) {
    console.error("Error storing data:", error);
    alert("An error occurred while storing the data. Please try again.");
  }
});

// Generate QR Code
function generateQRCode(libraryIdNo) {
  const qrData = `https://your-site-url.com/scan?libraryIdNo=${libraryIdNo}`;
  QRCode.toDataURL(qrData, (err, url) => {
    if (err) {
      console.error("Error generating QR code:", err);
      return;
    }
    const qrCodeImg = document.getElementById("qr-code");
    if (qrCodeImg) qrCodeImg.src = url;
  });
}
