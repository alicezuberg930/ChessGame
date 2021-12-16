<!DOCTYPE html>
<html>

<head>
    <title>Đăng Nhập</title>
    <meta charset="utf-8">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.3.1/css/all.css">
    <link rel="stylesheet" type="text/css" href="css/LoginRegister/LoginRegister.css">
</head>

<body>
    <div class="form-box">
        <div class="button-box">
            <div id="slider" class="slider"></div>
            <button class="toggle-button" id="login-slider">
                <span>Đăng Nhập</span>
            </button>
            <button class="toggle-button" id="register-slider">
                <span>Đăng Kí</span>
            </button>
        </div>
        <form id="login_form" class="input-group" action="">
            <div class="form-control">
                <input type="text" class="user-id" id="username" placeholder="Nhập tên người dùng">
                <span class="username_response">a</span>
                <i id="success-username" class="far fa-check-circle"></i>
                <i id="error-username" class="fas fa-exclamation-circle"></i>
            </div>
            <div class="form-control">
                <input type="password" class="user-id" id="password" placeholder="Nhập mật khẩu">
                <span class="password_response">a</span>
                <i id="success-password" class="far fa-check-circle"></i>
                <i id="error-password" class="fas fa-exclamation-circle"></i>
            </div>
            <div class="term">
                <input type="checkbox" class="check-box">
                <span>Nhớ mật khẩu</span>
            </div>
            <button class="submit" id="login-button">Đăng Nhập</button>
            <p><a href="">Quên mật khẩu?</a></p>
        </form>
        <form id="register_form" class="input-group" action="">
            <div class="form-control">
                <input type="text" class="user-id r-username" id="r-username" placeholder="Nhập tên người dùng">
                <span class="r_username_response">a</span>
                <i id="success-r-username" class="far fa-check-circle"></i>
                <i id="error-r-username" class="fas fa-exclamation-circle"></i>
            </div>
            <div class="form-control">
                <input type="password" class="user-id r-password" id="r-password" placeholder="Nhập mật khẩu">
                <span class="r_password_response">a</span>
                <i id="success-r-password" class="far fa-check-circle"></i>
                <i id="error-r-password" class="fas fa-exclamation-circle"></i>
            </div>
            <div class="form-control">
                <input type="password" class="user-id r-check-password" id="retype_password" placeholder="Nhập lại mật khẩu">
                <span class="retype_password_response">a</span>
                <i id="success-retype-password" class="far fa-check-circle"></i>
                <i id="error-retype-password" class="fas fa-exclamation-circle"></i>
            </div>
            <div class="term-2">
                <input type="checkbox" class="check-box">
                <span>Tôi đồng ý với điều khoản và dịch vụ</span>
            </div>
            <button class="submit" id="register-button">Đăng Kí</button>
        </form>
    </div>

    <div class="verify"></div>
    <div class="overlay" id="overlay"></div>
    <script src="js/jquery-3.6.0.js"></script>
    <script type="text/javascript" src="js/LoginRegister/LoginRegister.js"></script>
</body>

</html>