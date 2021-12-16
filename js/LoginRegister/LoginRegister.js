const verify = document.querySelector(".verify");
const login_side = document.getElementById("login-slider");
const register_side = document.getElementById("register-slider");
register_side.addEventListener("click", () => {
    document.getElementById("login_form").style.left = "-400px";
    document.getElementById("register_form").style.right = "80px";
    document.getElementById("slider").style.left = "120px";
});
login_side.addEventListener("click", () => {
    document.getElementById("login_form").style.left = "75px";
    document.getElementById("register_form").style.right = "-450px";
    document.getElementById("slider").style.left = "0";
});

Visible = ($element) => {
    $element.css("visibility", "visible");
}
Invisible = ($element) => {
    $element.css("visibility", "hidden");
}

SetError = ($username_response, $username_input, $error_icon, $success_icon, $data) => {
    $username_response.html($data);
    Visible($username_response);
    $username_response.css("color", "rgb(207, 20, 20)");
    $username_input.css("border-color", "rgb(207, 20, 20)");
    Visible($error_icon);
    $error_icon.css("color", "rgb(207, 20, 20)");
    Invisible($success_icon);
}

SetSuccess = ($username_response, $username_input, $error_icon, $success_icon) => {
    Visible($success_icon);
    $success_icon.css("color", "rgb(20, 223, 20)");
    Invisible($error_icon);
    Invisible($username_response);
    $username_input.css("border-color", "rgb(20, 223, 20)");
}

$("#login-button").click((e) => {
    $.ajax({
        method: "post",
        dataType: "json",
        url: "php/LoginRegister/LoginAction.php",
        data: { UserName: $("#username").val(), Password: $("#password").val() },
        success: function (result) {
            if (result.UserName != '') {
                SetError($(".username_response"), $("#username"), $("#error-username"), $("#success-username"), result.UserName);
            } else {
                SetSuccess($(".username_response"), $("#username"), $("#error-username"), $("#success-username"));
            }
            if (result.Password != '') {
                SetError($(".password_response"), $("#password"), $("#error-password"), $("#success-password"), result.Password);
            } else {
                SetSuccess($(".password_response"), $("#password"), $("#error-password"), $("#success-password"));
            }
            if (result.UserName == '' && result.Password == '') {
                setTimeout(() => { window.location.href = "Home.php"; }, 1000);
            }
        }
    });
    e.preventDefault();
});

$("#register-button").click((e) => {
    $.ajax({
        method: "post",
        dataType: "json",
        url: "php/LoginRegister/RegisterAction.php",
        data: { UserName: $("#r-username").val(), Password: $("#r-password").val(), Retype_Password: $("#retype_password").val() },
        success: function (result) {
            if (result.UserName != '') {
                SetError($(".r_username_response"), $("#r-username"), $("#error-r-username"), $("#success-r-username"), result.UserName);
            } else {
                SetSuccess($(".r_username_response"), $("#r-username"), $("#error-r-username"), $("#success-r-username"));
            }
            if (result.Password != '') {
                SetError($(".r_password_response"), $("#r-password"), $("#error-r-password"), $("#success-r-password"), result.Password);
            } else {
                SetSuccess($(".r_password_response"), $("#r-password"), $("#error-r-password"), $("#success-r-password"));
            }
            if (result.Retype_Password != '') {
                SetError($(".retype_password_response"), $("#retype_password"), $("#error-retype-password"), $("#success-retype-password"), result.Retype_Password);
            } else {
                SetSuccess($(".retype_password_response"), $("#retype_password"), $("#error-retype-password"), $("#success-retype-password"));
            }
            if (result.UserName == '' && result.Password == '' && result.Retype_Password == '') {
                setTimeout(() => { window.location.href = "LoginRegister.php"; }, 1000);
            }
        }
    });
    e.preventDefault();
});