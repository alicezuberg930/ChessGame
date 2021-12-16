<?php session_start();
session_destroy();
if ($_SESSION['UserName'] != 'You') {
    $_SESSION['UserName'] = "You";
    $_SESSION['ProfilePicture'] = "https://www.chess.com/bundles/web/images/user-image.007dad08.svg";
    header("location: ../../Home.php");
}
