<?php session_start();
require_once("../DatabaseConnection.php");
$warnings = array('UserName' => '', 'Password' => '');
$UserName = $_POST["UserName"];
$Password = $_POST["Password"];
$FindUser = Query("select * from userinfo where UserName='$UserName'");
if (mysqli_num_rows($FindUser) > 0) {
    if (isset($_POST["remember"])) {
        setcookie("UserName", $UserName);
    }
    $row = mysqli_fetch_assoc($FindUser);
    if ($row['Password'] == $Password) {
        $_SESSION['UserName'] = $UserName;
        $_SESSION['UserID'] = $row['ID'];
        $_SESSION["Password"] = $Password;
        $_SESSION['ProfilePicture'] = $row['ProfilePicture'];
    } else {
        $warnings["Password"] = "Password doesn't match";
    }
} else {
    $warnings["UserName"] = "UserName is wrong";
    $warnings["Password"] = "Password is empty";
}
die(json_encode($warnings));
