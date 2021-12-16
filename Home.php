<?php session_start();
$LoginButton = $RegisterButton = $UserNameButton = $LogoutButton = '';
if (!isset($_SESSION['UserName']) || $_SESSION['UserName'] == 'You') {
    $LoginButton = $RegisterButton = 'style="display: block;"';
    $UserNameButton = $LogoutButton = 'style="display: none;"';
} else if ($_SESSION['UserName'] != "You") {
    $LoginButton = $RegisterButton = 'style="display: none;"';
} ?>
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Home</title>
    <link rel="stylesheet" href="css/SideBar/SideBar.css" type="text/css">
    <link rel="stylesheet" href="css/Home/Home.css" type="text/css">
</head>

<body>
    <div class="base-layout">
        <div class="base-sidebar">
            <a class="home-logo" href="Home.php">
                <img src="images/chess-logo.png">
            </a>
            <button <?php echo $LoginButton ?>><a href="LoginRegister.php">Đăng Nhập</a></button>
            <button <?php echo $RegisterButton ?>><a href="LoginRegister.php">Đăng Kí</a></button>
            <button <?php echo $UserNameButton ?>><?php echo $_SESSION['UserName'] ?></button>
            <button <?php echo $LogoutButton ?> id="LogOut"><a href="php/LoginRegister/Logout.php">Đăng Xuất</a></button>
        </div>
        <div class="base-container">
            <section class="index-guest-block">
                <div class="image-container">
                    <img src="images/ChessBoard.jpg">
                </div>
                <div class="index-intro">
                    <h1 class="index-title">
                        <span>Chơi cờ vua</span>
                        <span>miễn phí</span>
                        <span>trên website</span>
                    </h1>
                    <div class="index-info">
                        <p>0 trận hôm nay</p>
                        <p>2 người đang chơi</p>
                    </div>
                    <div class="index-guest-button-wrap">
                        <button name="multiplayer" class="online-button">
                            <a href="Online.php">
                                <img src="images/playhand.png" class="index-guest-button-icon index-playhand-icon">
                                <div>
                                    <h2>Chơi Online</h2>
                                    <span>Chơi với đối thủ cùng đẳng cấp</span>
                                </div>
                            </a>
                        </button>
                        <button class="offline-button">
                            <a href="Computer.php">
                                <img src="images/computer.png" class="index-guest-button-icon index-computer-icon">
                                <div>
                                    <h2>Chơi với máy</h2>
                                    <span>Huấn luyện với máy tính</span>
                                </div>
                            </a>
                        </button>
                    </div>
                </div>
            </section>
        </div>
        </section>
    </div>
    <script src="js/jquery-3.6.0.js"></script>
</body>

</html>