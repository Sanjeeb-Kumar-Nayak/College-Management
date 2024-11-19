$(document).ready(function () {
  restictPage();
  showNavbar("header-toggle", "nav-bar", "body-pd", "header");

  /*===== LINK ACTIVE =====*/
  const $linkColor = $(".nav_link");

  $linkColor.on("click", colorLink);
  setTimeout(() => {
    studentDetails();
  }, [1000]);
  studentAttendenceListing();
  studentResultListing();
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

function colorLink() {
  $linkColor.removeClass("active");
  $(this).addClass("active");
}

let studentData = JSON.parse(sessionStorage.getItem("student"));

function studentDetails() {
  $("#studentName")
    .css("font-weight", "bold")
    .text("Name: " + studentData.name);

  $("#branch")
    .css("font-weight", "bold")
    .text(
      "Branch: " +
        (studentData.branchId == 1
          ? "CSE"
          : studentData.branchId == 2
          ? "IT"
          : "N/A")
    );

  $("#mobileNumber")
    .css("font-weight", "bold")
    .text("Mobile Number: " + studentData.mobileNumber);

  $("#email")
    .css("font-weight", "bold")
    .text("E-Mail: " + studentData.email);

  $("#address")
    .css("font-weight", "bold")
    .text("Address: " + studentData.address);
}

function studentAttendenceListing() {
  let formData = new FormData();
  formData.append("id", parseInt(studentData.id));

  $.ajax({
    type: "POST",
    dataType: "json",
    processData: false,
    contentType: false,
    url: apiURL + "student/getAttendanceByStudentId",
    data: formData,
    success: function (response) {
      $("#attendenceList").DataTable().destroy();
      var table = $("#attendenceList").DataTable({
        bLengthChange: false,
        searching: false,
        paging: true,
        info: true,
        columns: [
          { title: "Subject" },
          { title: "Year" },
          { title: "Month" },
          { title: "Total Class" },
          { title: "Attend Class" },
        ],
      });

      table.clear(); // Clear any existing data

      response.data.attendance.forEach(function (data) {
        var rowData = [
          data.subjectName || "N/A",
          data.yearName || "N/A",
          data.monthName || "N/A",
          data.totalClass || "N/A",
          data.classAttend || "N/A",
        ];

        table.row.add(rowData); // Add the row to the table
      });
      table.draw(); // Redraw the table with new data
    },
    error: function (err) {
      console.error("AJAX error:", err);
    },
  });
}

function studentResultListing() {
  let formData = new FormData();
  formData.append("id", parseInt(studentData.id));

  $.ajax({
    type: "POST",
    dataType: "json",
    processData: false,
    contentType: false,
    url: apiURL + "student/getResultByStudentId",
    data: formData,
    success: function (response) {
      $("#resultList").DataTable().destroy();
      var table = $("#resultList").DataTable({
        bLengthChange: false,
        searching: false,
        paging: true,
        info: true,
        columns: [
          { title: "Semester" },
          { title: "Internal" },
          { title: "Subject" },
          { title: "Total Mark" },
          { title: "Scored Mark" },
        ],
      });

      table.clear(); // Clear any existing data

      response.data.result.forEach(function (data) {
        var rowData = [
          data.semesterName || "N/A",
          data.examName || "N/A",
          data.subjectName || "N/A",
          data.totalMark || "N/A",
          data.markScored || "N/A",
        ];

        table.row.add(rowData); // Add the row to the table
      });
      table.draw(); // Redraw the table with new data
    },
    error: function (err) {
      console.error("AJAX error:", err);
    },
  });
}

function logOut() {
  window.location.href = "login.html";
}
