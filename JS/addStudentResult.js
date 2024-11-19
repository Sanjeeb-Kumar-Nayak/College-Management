$(document).ready(function () {
  restictPage();
  showNavbar("header-toggle", "nav-bar", "body-pd", "header");

  /*===== LINK ACTIVE =====*/
  const $linkColor = $(".nav_link");

  // Mark the "Result" link as active
  highlightActiveLink();

  $linkColor.on("click", colorLink);
  getAllStudent();
  getAllSemester();
  getAllInternal();
  getAllSubject();
});

function restictPage() {
  let studentData = sessionStorage.getItem("student");
  if (!studentData) {
    window.location.href = "login.html";
  }
}

const showNavbar = (toggleId, navId, bodyId, headerId) => {
  const $toggle = $("#" + toggleId),
    $nav = $("#" + navId),
    $bodypd = $("#" + bodyId),
    $headerpd = $("#" + headerId);

  // Validate that all elements exist
  if ($toggle.length && $nav.length && $bodypd.length && $headerpd.length) {
    $toggle.on("click", () => {
      // Show navbar
      $nav.toggleClass("show");
      // Change icon
      $toggle.toggleClass("bx-x");
      // Add padding to body and header
      $bodypd.toggleClass("body-pd");
      $headerpd.toggleClass("body-pd");
    });
  }
};

function highlightActiveLink() {
  const currentUrl = window.location.href; // Get the current URL
  const studentLink = $("a[href='addStudentResult.html']"); // Find the link with href="addStudentResult.html"

  // Check if the current page is the student page (addStudentResult.html)
  if (currentUrl.includes("addStudentResult.html")) {
    studentLink.addClass("active"); // Add 'active' class to the student link
  } else {
    studentLink.removeClass("active"); // Remove the 'active' class if not on the student page
  }
}

function colorLink() {
  $linkColor.removeClass("active");
  $(this).addClass("active");
}

function getAllStudent() {
  $.ajax({
    url: apiURL + "student/getAllStudent",
    type: "POST",
    contentType: "application/json",
    success: function (response) {
      $("#studentId")
        .empty()
        .append('<option value="">Select Student</option>');
      $.each(response.data.allStudentList, function (key, val) {
        $("#studentId").append(
          "<option value='" + val.id + "'>" + val.name + "</option>"
        );
      });
    },
  });
}

function getAllSemester() {
  $.ajax({
    url: apiURL + "student/getAllSemester",
    type: "POST",
    contentType: "application/json",
    success: function (response) {
      $("#semesterId")
        .empty()
        .append('<option value="">Select Semester</option>');
      $.each(response.data.subjectList, function (key, val) {
        $("#semesterId").append(
          "<option value='" + val.id + "'>" + val.name + "</option>"
        );
      });
    },
  });
}

function getAllInternal() {
  $.ajax({
    url: apiURL + "student/getAllExam",
    type: "POST",
    contentType: "application/json",
    success: function (response) {
      $("#internalId")
        .empty()
        .append('<option value="">Select Internal</option>');
      $.each(response.data.examList, function (key, val) {
        $("#internalId").append(
          "<option value='" + val.id + "'>" + val.name + "</option>"
        );
      });
    },
  });
}

function getAllSubject() {
  $.ajax({
    url: apiURL + "student/getAllSubject",
    type: "POST",
    contentType: "application/json",
    success: function (response) {
      $("#subjectId")
        .empty()
        .append('<option value="">Select Subject</option>');
      $.each(response.data.subjectList, function (key, val) {
        $("#subjectId").append(
          "<option value='" + val.id + "'>" + val.name + "</option>"
        );
      });
    },
  });
}

function formValidation() {
  let isValid = true;
  let studentResultData = {};

  // Student validation
  let studentId = $("#studentId").val();
  let studentError = $("#studentError");
  if (studentId == 0) {
    studentError.text("Role is Required").show();
    if (isValid) $("#studentId").focus();
    isValid = false;
  } else {
    studentError.hide();
    studentResultData.studentId = parseInt(studentId);
  }

  // Semester validation
  let semesterId = $("#semesterId").val();
  let semesterError = $("#semesterError");
  if (semesterId == 0) {
    semesterError.text("Semester is Required").show();
    if (isValid) $("#semesterId").focus();
    isValid = false;
  } else {
    semesterError.hide();
    studentResultData.semesterId = parseInt(semesterId);
  }

  // Internal validation
  let internalId = $("#internalId").val();
  let internalError = $("#internalError");
  if (internalId == 0) {
    internalError.text("Internal is Required").show();
    if (isValid) $("#internalId").focus();
    isValid = false;
  } else {
    internalError.hide();
    studentResultData.internalId = parseInt(internalId);
  }

  // Subject validation
  let subjectId = $("#subjectId").val();
  let subjectError = $("#subjectError");
  if (subjectId == 0) {
    subjectError.text("Subject is Required").show();
    if (isValid) $("#subjectId").focus();
    isValid = false;
  } else {
    subjectError.hide();
    studentResultData.subjectId = parseInt(subjectId);
  }

  // Total Mark validation
  let totalMark = $("#totalMark");
  let totalMarkError = $("#totalMarkError");
  if (!totalMark.val().trim()) {
    totalMarkError.text("Total Mark is Required").show();
    if (isValid) totalMark.focus();
    isValid = false;
  } else {
    totalMarkError.hide();
    studentResultData.totalMark = totalMark.val().trim();
  }

  // Scored Mark validation
  let scoredMark = $("#scoredMark");
  let scoredMarkError = $("#scoredMarkError");
  if (!scoredMark.val().trim()) {
    scoredMarkError.text("Scored Mark is Required").show();
    if (isValid) scoredMark.focus();
    isValid = false;
  } else {
    scoredMarkError.hide();
    studentResultData.scoredMark = scoredMark.val().trim();
  }

  return { isValid, studentResultData };
}

function addStudentResult() {
  const validationResult = formValidation();
  if (validationResult.isValid) {
    let jsonData = {
      studentId: validationResult.studentResultData.studentId,
      semesterId: validationResult.studentResultData.semesterId,
      examId: validationResult.studentResultData.internalId,
      subject: validationResult.studentResultData.subjectId,
      totalMark: validationResult.studentResultData.totalMark,
      markScored: validationResult.studentResultData.scoredMark,
    };

    let formData = new FormData();
    formData.append("data", JSON.stringify(jsonData));

    $.ajax({
      type: "POST",
      dataType: "json",
      processData: false,
      contentType: false,
      url: apiURL + "student/createStudentResult",
      data: formData,
      success: function (response) {
        if (response["status"] == 0) {
          Swal.fire({
            icon: "error",
            title: response.message,
            confirmButtonText: "Ok",
          });
        } else {
          Swal.fire({
            icon: "success",
            title: response.message,
            confirmButtonText: "Ok",
          }).then(() => onClickReset());
        }
      },
    });
  } else {
    console.log("Form is invalid. Please correct the errors.");
  }
}

function onClickReset() {
  document.getElementById("createStudentResult").reset();
  document
    .querySelectorAll(".error-message")
    .forEach((msg) => (msg.style.display = "none"));
}

function logOut() {
  window.location.href = "login.html";
}
