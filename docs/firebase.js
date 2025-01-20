// Initialize Firebase
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
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const departmentSelect = document.getElementById("department-select");
const courseSelect = document.getElementById("course-select");
const majorSelect = document.getElementById("major-select");
const gradeSelect = document.getElementById("grade-select");
const strandSelect = document.getElementById("strand-select");
const gradeInputDiv = document.querySelector(".grade-input");
const courseInputDiv = document.querySelector(".course-input");
const majorInputDiv = document.querySelector(".year-input");
const strandInputDiv = document.querySelector(".strand-input");
const submitButton = document.querySelector(".submit");
const libraryIdInput = document.getElementById("library-id");
const validUntilInput = document.getElementById("valid-until");

// Handle URL parameters
const urlParams = new URLSearchParams(window.location.search);
const libraryIdNo = urlParams.get('libraryIdNo');
const token = urlParams.get('token');

if (libraryIdNo && token) {
  // Fetch student data from Firebase
  db.collection("LIDC_Users").doc(libraryIdNo).get().then((doc) => {
    if (doc.exists) {
      const data = doc.data();
      if (data.token === token) {
        document.getElementById("last-name").value = data.lastName;
        document.getElementById("first-name").value = data.firstName;
        document.getElementById("gender").value = data.gender;
        document.getElementById("department-select").value = data.department;
        document.getElementById("course-select").value = data.course;
        document.getElementById("major-select").value = data.major;
        document.getElementById("grade-select").value = data.grade;
        document.getElementById("strand-select").value = data.strand;
        document.getElementById("year-select").value = data.schoolYear;
        document.getElementById("semester-select").value = data.semester;
      } else {
        alert("Invalid token.");
      }
    } else {
      alert("No such document!");
    }
  }).catch((error) => {
    console.error("Error fetching document:", error);
  });
}

departmentSelect.addEventListener("change", () => {
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

gradeSelect.addEventListener("change", () => {
  const selectedGrade = gradeSelect.value;
  if (selectedGrade) {
    strandInputDiv.style.display = "block";
  } else {
    strandInputDiv.style.display = "none";
  }
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

// Handle form submission
submitButton.addEventListener("click", async (event) => {
  event.preventDefault();

  const lastName = document.querySelector(".name-inputs .data-input:nth-child(1) input").value.trim();
  const firstName = document.querySelector(".name-inputs .data-input:nth-child(2) input").value.trim();
  const gender = document.querySelector(".gender select").value.trim();
  const department = departmentSelect.value.trim();
  const course = courseSelect.value.trim();
  const major = majorSelect.value.trim();
  const grade = gradeSelect.value.trim();
  const strand = strandSelect.value.trim();
  const schoolYear = document.querySelector(".year-sem-inputs .data-input:nth-child(1) select").value.trim();
  const semester = document.querySelector(".year-sem-inputs .data-input:nth-child(2) select").value.trim();

  if (!lastName || !firstName || !gender || !department || (!course && department !== "shs") || (!major && department !== "shs") || !schoolYear || !semester || (department === "shs" && (!grade || !strand))) {
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
    course: department === "shs" ? "" : course,
    major: department === "shs" ? "" : major,
    grade: department === "shs" ? grade : "",
    strand: department === "shs" ? strand : "",
    schoolYear,
    semester,
    timesEntered: 0,
    token: generateRandomToken(),  // Add the random token here
  };

  try {
    const userRef = doc(db, "LIDC_Users", newEntry.libraryIdNo);
    await setDoc(userRef, newEntry);
    alert("Data successfully submitted!");
    generateQRCodeAndDownload(newEntry);  // Generate QR and trigger download
    window.location.reload();
  } catch (error) {
    console.error("Error storing data:", error);
    alert("An error occurred while storing the data. Please try again.");
  }
});