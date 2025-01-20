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
  
  // Get the student ID from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const studentId = urlParams.get('id');
  
  if (studentId) {
    // Fetch student data from Firebase
    db.collection("LIDC_Users").doc(studentId).get().then((doc) => {
      if (doc.exists) {
        const data = doc.data();
        document.getElementById("last-name").value = data.lastName;
        document.getElementById("first-name").value = data.firstName;
        document.getElementById("gender").value = data.gender;
        document.getElementById("department").value = data.department;
        document.getElementById("course").value = data.course;
        document.getElementById("major").value = data.major;
        document.getElementById("grade").value = data.grade;
        document.getElementById("strand").value = data.strand;
        document.getElementById("school-year").value = data.schoolYear;
        document.getElementById("semester").value = data.semester;
      } else {
        alert("No such document!");
      }
    }).catch((error) => {
      console.error("Error fetching document:", error);
    });
  }