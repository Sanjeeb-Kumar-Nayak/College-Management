function togglePasswordVisibility() {
  const $passwordInput = $("#password");
  const $passwordIcon = $passwordInput.next();

  if ($passwordInput.attr("type") === "password") {
    $passwordInput.attr("type", "text");
    $passwordIcon.removeClass("bxs-show").addClass("bxs-hide");
    $passwordIcon.attr("aria-label", "Hide password");
  } else {
    $passwordInput.attr("type", "password");
    $passwordIcon.removeClass("bxs-hide").addClass("bxs-show");
    $passwordIcon.attr("aria-label", "Show password");
  }
}

function formValidation() {
  let isValid = true;
  let logInData = {};

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
    logInData.mobileNumber = mobileNumber.val().trim();
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
    logInData.password = password.val().trim();
  }

  return { isValid, logInData };
}

function logIn() {
  const validationResult = formValidation();
  if (validationResult.isValid) {
    let jsonData = {
      mobileNumber: parseInt(validationResult.logInData.mobileNumber),
      password: validationResult.logInData.password,
    };

    $.ajax({
      url: apiURL + "student/login",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(jsonData),
      success: function (response) {
        sessionStorage.setItem("student", JSON.stringify(response.data.user));
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
          }).then(() => {
            if (response.data.user.role == 1) {
              window.location.href = "admin.html";
            } else if (response.data.user.role == 2) {
              window.location.href = "student.html";
            }
          });
        }
      },
    });
  } else {
    console.log("Form is invalid. Please correct the errors.");
  }
}
