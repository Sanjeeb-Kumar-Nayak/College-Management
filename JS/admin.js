$(document).ready(function () {
  restictPage();
  showNavbar("header-toggle", "nav-bar", "body-pd", "header");

  /*===== LINK ACTIVE =====*/
  const $linkColor = $(".nav_link");

  // Mark the "Student" link as active
  highlightActiveLink();

  $linkColor.on("click", colorLink);
  studentListing();
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
  const studentLink = $("a[href='admin.html']"); // Find the link with href="admin.html"

  // Check if the current page is the student page (admin.html)
  if (currentUrl.includes("admin.html")) {
    studentLink.addClass("active"); // Add 'active' class to the student link
  } else {
    studentLink.removeClass("active"); // Remove the 'active' class if not on the student page
  }
}

function colorLink() {
  $linkColor.removeClass("active");
  $(this).addClass("active");
}

function formValidation() {
  let isValid = true;
  let studentData = {};

  // Name validation
  let name = $("#name");
  let nameError = $("#nameError");
  if (!name.val().trim()) {
    nameError.text("Name is Required").show();
    if (isValid) name.focus();
    isValid = false;
  } else {
    nameError.hide();
    studentData.name = name.val().trim();
  }

  // Branch validation
  let branch = $("#branch").val();
  let branchError = $("#branchError");
  if (branch == 0) {
    branchError.text("Role is Required").show();
    if (isValid) $("#branch").focus();
    isValid = false;
  } else {
    branchError.hide();
    studentData.branch = parseInt(branch);
  }

  // Mobile Number validation
  let mobileNumber = $("#mobileNumber");
  let mobileNumberError = $("#mobileNumberError");
  let mobilePattern = /^[0-9]{10}$/;
  if (!mobileNumber.val().trim()) {
    mobileNumberError.text("Mobile Number is Required").show();
    if (isValid) mobileNumber.focus();
    isValid = false;
  } else if (!mobilePattern.test(mobileNumber.val().trim())) {
    mobileNumberError.text("Enter a valid 10-digit Mobile Number").show();
    if (isValid) mobileNumber.focus();
    isValid = false;
  } else {
    mobileNumberError.hide();
    studentData.mobileNumber = mobileNumber.val().trim();
  }

  // Email validation
  let email = $("#email");
  let emailError = $("#emailError");
  let emailPattern = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,6}$/;
  if (!email.val().trim()) {
    emailError.text("Email is Required").show();
    if (isValid) email.focus();
    isValid = false;
  } else if (!emailPattern.test(email.val().trim())) {
    emailError.text("Enter a valid Email Address").show();
    if (isValid) email.focus();
    isValid = false;
  } else {
    emailError.hide();
    studentData.email = email.val().trim();
  }

  // Password validation
  let password = $("#password");
  let passwordError = $("#passwordError");
  if (!password.val().trim()) {
    passwordError.text("Password is Required").show();
    if (isValid) password.focus();
    isValid = false;
  } else {
    passwordError.hide();
    studentData.password = password.val().trim();
  }

  // Address validation
  let address = $("#address");
  let addressError = $("#addressError");
  if (!address.val().trim()) {
    addressError.text("Address is Required").show();
    if (isValid) address.focus();
    isValid = false;
  } else {
    addressError.hide();
    studentData.address = address.val().trim();
  }

  return { isValid, studentData };
}

function addStudent() {
  const validationResult = formValidation();
  if (validationResult.isValid) {
    let jsonData = {
      name: validationResult.studentData.name,
      branchId: validationResult.studentData.branch,
      mobileNumber: validationResult.studentData.mobileNumber,
      email: validationResult.studentData.email,
      password: validationResult.studentData.password,
      address: validationResult.studentData.address,
      role: 2,
    };

    let formData = new FormData();
    formData.append("data", JSON.stringify(jsonData));

    $.ajax({
      type: "POST",
      dataType: "json",
      processData: false,
      contentType: false,
      url: apiURL + "student/createUser",
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
          }).then(() => onClickReset(), studentListing());
        }
      },
    });
  } else {
    console.log("Form is invalid. Please correct the errors.");
  }
}

function onClickReset() {
  document.getElementById("createStudent").reset();
  document
    .querySelectorAll(".error-message")
    .forEach((msg) => (msg.style.display = "none"));
}

function studentListing() {
  $.ajax({
    url: apiURL + "student/getAllStudent",
    type: "POST",
    contentType: "application/json",
    success: function (response) {
      $("#studentList").DataTable().destroy();
      var table = $("#studentList").DataTable({
        bLengthChange: false,
        searching: true,
        paging: true,
        info: true,
        columns: [
          { title: "Name" },
          { title: "Branch" },
          { title: "Mobile Number" },
          { title: "E-Mail" },
          { title: "Address" },
        ],
      });

      table.clear(); // Clear any existing data

      response.data.allStudentList.forEach(function (data) {
        var rowData = [
          data.name || "N/A",
          data.branchId == 1 ? "CSE" : data.branchId == 2 ? "IT" : "N/A", // Corrected the ternary logic
          data.mobileNumber || "N/A",
          data.email || "N/A",
          data.address || "N/A",
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
