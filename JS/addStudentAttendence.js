$(document).ready(function () {
  restictPage();
  showNavbar("header-toggle", "nav-bar", "body-pd", "header");

  /*===== LINK ACTIVE =====*/
  const $linkColor = $(".nav_link");

  // Mark the "Attendence" link as active
  highlightActiveLink();

  $linkColor.on("click", colorLink);
  getAllStudent();
  getAllSubject();
  getAllYear();
  getAllMonth();
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
  const studentLink = $("a[href='addStudentAttendence.html']"); // Find the link with href="addStudentAttendence.html"

  // Check if the current page is the student page (addStudentAttendence.html)
  if (currentUrl.includes("addStudentAttendence.html")) {
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

function getAllYear() {
  $.ajax({
    url: apiURL + "student/getAllYear",
    type: "POST",
    contentType: "application/json",
    success: function (response) {
      $("#yearId").empty().append('<option value="">Select Year</option>');
      $.each(response.data.year, function (key, val) {
        $("#yearId").append(
          "<option value='" + val.id + "'>" + val.name + "</option>"
        );
      });
    },
  });
}

function getAllMonth() {
  $.ajax({
    url: apiURL + "student/getAllMonth",
    type: "POST",
    contentType: "application/json",
    success: function (response) {
      $("#monthId").empty().append('<option value="">Select Month</option>');
      $.each(response.data.month, function (key, val) {
        $("#monthId").append(
          "<option value='" + val.id + "'>" + val.name + "</option>"
        );
      });
    },
  });
}

function formValidation() {
  let isValid = true;
  let studentAttendenceData = {};

  // Student validation
  let studentId = $("#studentId").val();
  let studentError = $("#studentError");
  if (studentId == 0) {
    studentError.text("Role is Required").show();
    if (isValid) $("#studentId").focus();
    isValid = false;
  } else {
    studentError.hide();
    studentAttendenceData.studentId = parseInt(studentId);
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
    studentAttendenceData.subjectId = parseInt(subjectId);
  }

  // Year validation
  let yearId = $("#yearId").val();
  let yearError = $("#yearError");
  if (yearId == 0) {
    yearError.text("Year is Required").show();
    if (isValid) $("#yearId").focus();
    isValid = false;
  } else {
    yearError.hide();
    studentAttendenceData.yearId = parseInt(yearId);
  }

  // Month validation
  let monthId = $("#monthId").val();
  let monthError = $("#monthError");
  if (monthId == 0) {
    monthError.text("Month is Required").show();
    if (isValid) $("#monthId").focus();
    isValid = false;
  } else {
    monthError.hide();
    studentAttendenceData.monthId = parseInt(monthId);
  }

  // Total Class validation
  let totalClass = $("#totalClass");
  let totalClassError = $("#totalClassError");
  if (!totalClass.val().trim()) {
    totalClassError.text("Total Class is Required").show();
    if (isValid) totalClass.focus();
    isValid = false;
  } else {
    totalClassError.hide();
    studentAttendenceData.totalClass = totalClass.val().trim();
  }

  // Attend Class validation
  let attendClass = $("#attendClass");
  let attendClassError = $("#attendClassError");
  if (!attendClass.val().trim()) {
    attendClassError.text("Attend Class is Required").show();
    if (isValid) attendClass.focus();
    isValid = false;
  } else {
    attendClassError.hide();
    studentAttendenceData.attendClass = attendClass.val().trim();
  }

  return { isValid, studentAttendenceData };
}

function addStudentAttendence() {
  const validationResult = formValidation();
  if (validationResult.isValid) {
    let jsonData = {
      studentId: validationResult.studentAttendenceData.studentId,
      subject: validationResult.studentAttendenceData.subjectId,
      yearId: validationResult.studentAttendenceData.yearId,
      monthId: validationResult.studentAttendenceData.monthId,
      totalClass: validationResult.studentAttendenceData.totalClass,
      classAttend: validationResult.studentAttendenceData.attendClass,
    };
    let formData = new FormData();
    formData.append("data", JSON.stringify(jsonData));

    $.ajax({
      type: "POST",
      dataType: "json",
      processData: false,
      contentType: false,
      url: apiURL + "student/createStudentAttendance",
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
  document.getElementById("createStudentAttendence").reset();
  document
    .querySelectorAll(".error-message")
    .forEach((msg) => (msg.style.display = "none"));
}

function logOut() {
  window.location.href = "login.html";
}
