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