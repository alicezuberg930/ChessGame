<?php require_once("../DatabaseConnection.php");
$check1 = $check2 = $check3 = 1;
$warnings = array('UserName' => '', 'Password' => '', 'Retype_Password' => '');
$UserName = $_POST["UserName"];
$Password = $_POST["Password"];
$Retype_Password = $_POST["Retype_Password"];
$FindUser = Query("select * from userinfo where UserName='$UserName'");
if ($UserName == '') {
    $warnings["UserName"] = "UserName is too short";
    $check1 = 0;
} else if (mysqli_num_rows($FindUser) == 1) {
    $warnings["UserName"] = "UserName is already existed";
    $check1 = 0;
}
if (strlen($Password) <= 6) {
    $warnings["Password"] = "Password is too short";
    $check2 = 0;
}
if ($Password != $Retype_Password || $Retype_Password == null) {
    $warnings["Retype_Password"] = "Password doesn't match";
    $check3 = 0;
}
if ($check1 == 1 && $check2 == 1 && $check3 == 1) {
    Query("insert into userinfo(UserName, Password, ProfilePicture) values('$UserName','$Password','https://www.chess.com/bundles/web/images/user-image.007dad08.svg')");
}
die(json_encode($warnings));
