import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, doc, getDoc, getDocs, setDoc, collection, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

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
      "BS Automotive Technology": ["None"],
      "BS Electrical Technology": ["None"],
      "BS Electronics Technology": ["None"],
      "BS Mechanical Technology": ["None"],
      "BS Refrigeration and Air Conditioning Technology": ["None"],
      "BS Computer Technology": ["None"],
      "BS Civil Engineering": ["None"],
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
      "3-Year Trade Industrial Technical Education": ["Civil Technology", "Mechanical Technology", "Welding & Fabrication Technology"],
      "Associate in Industrial Technology": [
        "Auto Technology",
        "Electrical Technology",
        "Electronics Technology",
        "Food Technology",
        "Garments & Textile Technology",
        "Refrigeration and Air Conditioning Technology",
      ],
      "2-Year Trade Technical Education Curriculum": ["Technical Drafting Technology"],
    },
  },
  shs: {
    courses: {
      "Grade 11": ["None"],
      "Grade 12": ["None"],
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
const gradeSelect = document.getElementById("grade-select");
const strandSelect = document.getElementById("strand-select");
const gradeInputDiv = document.querySelector(".grade-input");
const strandInputDiv = document.querySelector(".strand-input");
const courseInputDiv = document.querySelector(".course-input");
const majorInputDiv = document.querySelector(".major-input");
const collegeInputDiv = document.querySelector(".college-input");

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

// Autofill Library ID and Valid Until Date
document.addEventListener("DOMContentLoaded", async () => {
  const libraryIdInput = document.getElementById("library-id");
  const validUntilInput = document.getElementById("valid-until");
  const patronSelect = document.querySelector('.patron select');
  const departmentInput = document.querySelector('.department-input');
  const courseInput = document.querySelector('.course-input');
  const majorInput = document.querySelector('.major-input');
  const strandInput = document.querySelector('.strand-input');
  const gradeInput = document.querySelector('.grade-input');
  const schoolSelect = document.querySelector('.school');
  const schoolSelected = document.querySelector('.school select');
  const specifySchoolInput = document.getElementById("specify-school-input");
  const campusDeptInput = document.querySelector('.campusdept');
  const collegeInput = document.querySelector('.college');

  if (!libraryIdInput || !validUntilInput || !patronSelect) {
    console.error("One or more required DOM elements are missing.");
    return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const libraryIdNo = urlParams.get('libraryIdNo'); // Get ID from URL if available

  // Function to toggle visibility based on patron type
  // Function to toggle visibility based on patron type
const toggleFields = (patronType) => {
  const departmentInput = document.querySelector(".department-input");
  const courseInput = document.querySelector(".course-input");
  const majorInput = document.querySelector(".major-input");
  const strandInput = document.querySelector(".strand-input");
  const gradeInput = document.querySelector(".grade-input");
  const schoolSelect = document.querySelector(".school");
  const specifySchoolInput = document.getElementById("specify-school-input");
  const campusDeptInput = document.querySelector(".campusdept");
  const collegeInput = document.querySelector(".college");

  switch (patronType) {
    case "visitor":
      departmentInput.style.display = "none";
      courseInput.style.display = "none";
      majorInput.style.display = "none";
      strandInput.style.display = "none";
      gradeInput.style.display = "none";
      schoolSelect.style.display = "block"; // Show school input for visitors
      campusDeptInput.style.display = "none"; // Hide office input for visitors
      collegeInput.style.display = "none"; // Hide college input for visitors
      specifySchoolInput.style.display = "block"; // Show specify school input
      break;
    case "faculty":
      departmentInput.style.display = "none";
      courseInput.style.display = "none";
      majorInput.style.display = "none";
      strandInput.style.display = "none";
      gradeInput.style.display = "none";
      schoolSelect.style.display = "none"; // Hide school input for faculty
      campusDeptInput.style.display = "none"; // Hide office input for faculty
      collegeInput.style.display = "block"; // Show college input for faculty
      specifySchoolInput.style.display = "none"; // Hide specify school input
      break;
    case "admin":
      departmentInput.style.display = "none";
      courseInput.style.display = "none";
      majorInput.style.display = "none";
      strandInput.style.display = "none";
      gradeInput.style.display = "none";
      schoolSelect.style.display = "none"; // Hide school input for admin
      campusDeptInput.style.display = "block"; // Show office input for admin
      collegeInput.style.display = "none"; // Hide college input for admin
      specifySchoolInput.style.display = "none"; // Hide specify school input
      break;
    default: // student
      departmentInput.style.display = "block";
      courseInput.style.display = "block";
      majorInput.style.display = "block";
      strandInput.style.display = "none";
      gradeInput.style.display = "none";
      schoolSelect.style.display = "none"; // Hide school input for students
      campusDeptInput.style.display = "none"; // Hide office input for students
      collegeInput.style.display = "none"; // Hide college input for students
      specifySchoolInput.style.display = "none"; // Hide specify school input
      break;
  }
};

  const toggleSpecifySchoolInput = () => {
    if (schoolSelected && schoolSelected.value === 'other') {
      specifySchoolInput.style.display = 'block'; // Show the input field
    } else {
      specifySchoolInput.style.display = 'none'; // Hide the input field
    }
  };

  // Event listener for when patron type is changed
  patronSelect.addEventListener('change', (event) => {
    toggleFields(event.target.value);
  });

  // Event listener for when school selection is changed
  schoolSelect.addEventListener('change', toggleSpecifySchoolInput);

  // Initialize fields based on default patron type and school selection
  toggleFields(patronSelect.value);
  toggleSpecifySchoolInput(); // Ensure the input field is shown/hidden based on the current selection

  if (libraryIdNo) {
    // Fetch data for the specific Library ID
    try {
      const userRef = doc(db, "LIDC_Users", libraryIdNo);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        // Fill input fields with existing user data
        libraryIdInput.value = userData.libraryIdNo;
        validUntilInput.value = userData.validUntil || "July 2025"; // Default if missing
        displayUserData(userData); // Load other user details
        toggleFields(userData.patronType); // Apply visibility logic based on patron type

        // Update courses and majors based on department and course
        await updateCourses(userData.department);
        courseSelect.value = userData.course; // Autofill course
        await updateMajors(userData.course, userData.department);
        majorSelect.value = userData.major; // Autofill major

        // Set other fields
        gradeSelect.value = userData.grade;
        strandSelect.value = userData.strand;
        // Set school year and semester if applicable
        document.getElementById("year-select").value = userData.schoolYear;
        document.getElementById("semester-select").value = userData.semester;

        // Hide or show fields based on department
        if (userData.department === "shs") {
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
      } else {
        console.error("No data found for the given Library ID.");
        alert("User not found.");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  } else {
    // Generate a new Library ID
    try {
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
      console.error("Error generating Library ID:", error);
      alert("Failed to generate Library ID. Please refresh the page.");
    }

    // Set Valid Until Date for new entries
    validUntilInput.value = "July 2025";
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

// Submit Form
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

      // You can also generate QR code for this entry and save it
      const fullQRCodeLink = `https://enzoitan.github.io/LCC-Registration-Form-web/?libraryIdNo=${libraryIdNo}&token=${userData.token}`;
      const qrCodeData = await generateQRCodeData(fullQRCodeLink);

      // Save the QR code data to Firestore
      await setDoc(userRef, {
        qrCodeURL: fullQRCodeLink,
        qrCodeImage: qrCodeData
      }, { merge: true });

      // Trigger the download of QR code
      downloadQRCode(qrCodeData, `${libraryIdNo}.png`);
    }

    // Reload the page after successful submission
    window.location.reload();
  } catch (error) {
    console.error("Error storing data:", error);
    alert("An error occurred while storing the data. Please try again.");
  }
});

// Show or hide the "Specify School" input field when "Other" is selected
document.getElementById("school-select").addEventListener("change", (event) => {
  const specifySchoolInput = document.getElementById("specify-school-input");
  if (event.target.value === "other") {
    specifySchoolInput.style.display = "block"; // Show the input field
  } else {
    specifySchoolInput.style.display = "none"; // Hide the input field
  }
});

// Generate QR code and return as Base64 data URL
async function generateQRCodeData(data) {
  try {
    const qrDataURL = await QRCode.toDataURL(JSON.stringify(data), {
      width: 256,
      margin: 1,
    });
    return qrDataURL;
  } catch (error) {
    console.error("Error generating QR Code:", error);
    throw error;
  }
}

// Auto-download the QR code
function downloadQRCode(dataURL, filename) {
  const link = document.createElement("a");
  link.href = dataURL;
  link.download = filename;
  link.click();
}

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

async function displayUserData(userData) {
  const userDataDiv = document.getElementById("user-data");

  // Display each field of the fetched user data
  userDataDiv.innerHTML = `
    <p>Library ID: ${userData.libraryIdNo}</p>
    <p>Type of Patron: ${userData.patron}</p>
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

  toggleFields(userData.patron);

  // Update courses and majors based on department and course
  await updateCourses(userData.department);
  courseSelect.value = userData.course; // Autofill course
  await updateMajors(userData.course, userData.department);
  majorSelect.value = userData.major; // Autofill major

  // Hide or show fields based on department
  if (userData.department === "shs") {
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

// Generate QR Code and trigger download
async function generateQRCodeAndDownload(newEntry) {
  const fullQRCodeLink = `https://enzoitan.github.io/LCC-Registration-Form-web/?libraryIdNo=${newEntry.libraryIdNo}&token=${newEntry.token}`;

  try {
    // Generate QR code URL
    QRCode.toDataURL(fullQRCodeLink, async (err, url) => {
      if (err) {
        console.error("Error generating QR code:", err);
        alert("Failed to generate QR code. Please try again.");
        return;
      }

      // Trigger QR code download
      const link = document.createElement("a");
      link.href = url;
      link.download = `QR_Code_LibraryID_${newEntry.libraryIdNo}.png`;
      link.click();

      // Save the QR code URL to Firestore
      try {
        const userRef = doc(db, "LIDC_Users", newEntry.libraryIdNo);
        await setDoc(
          userRef,
          { qrCodeURL: fullQRCodeLink, qrImageURL: url },
          { merge: true }
        );
        console.log("QR code URL and image data saved to Firestore.");
      } catch (error) {
        console.error("Error saving QR code to Firestore:", error);
        alert("Failed to save QR code to Firestore.");
      }
    });
  } catch (error) {
    console.error("Unexpected error generating QR code:", error);
  }
}

// Handle URL parameters
const urlParams = new URLSearchParams(window.location.search);
const libraryIdNo = urlParams.get('libraryIdNo');
const token = urlParams.get('token');

if (libraryIdNo && token) {
  fetchUserData(libraryIdNo).then((userData) => {
    if (userData && userData.token === token) {
      document.querySelector(".patron select").value = userData.patron;
      document.querySelector(".name-inputs .data-input:nth-child(1) input").value = userData.lastName;
      document.querySelector(".name-inputs .data-input:nth-child(2) input").value = userData.firstName;
      document.querySelector(".name-inputs .data-input:nth-child(3) input").value = userData.middleInitial;
      document.querySelector(".gender select").value = userData.gender;
      document.getElementById("library-id").value = userData.libraryIdNo;
      document.getElementById("department-select").value = userData.department;

      // Update courses and majors based on department and course
      updateCourses(userData.department).then(() => {
        courseSelect.value = userData.course; // Autofill course
        updateMajors(userData.course, userData.department).then(() => {
          majorSelect.value = userData.major; // Autofill major
        });
      });

      document.getElementById("grade-select").value = userData.grade;
      document.getElementById("strand-select").value = userData.strand;
      document.getElementById("year-select").value = userData.schoolYear;
      document.getElementById("semester-select").value = userData.semester;

      // Hide or show fields based on department
      if (userData.department === "shs") {
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
  }).catch((error) => {
    console.error("Error fetching document:", error);
  });
}