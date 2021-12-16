<?php session_start();
$GameID = $_SESSION['GameID'];
$UserID = $_SESSION['UserID'];
require_once("../DatabaseConnection.php");
$Notify = array("Check" => "", "OpponentName" => "", "OpponentAvatar" => "");
$check = Query("SELECT * FROM gamematch WHERE GameID='$GameID'");
if (mysqli_num_rows($check) == 2) {
    $result = Query("SELECT UserName, ProfilePicture FROM gamematch, userinfo WHERE GameID='$GameID' AND UserID != '$UserID' AND ID = UserID");
    if ($row = mysqli_fetch_assoc($result)) {
        $Notify['Check'] = 'Opponent found';
        $Notify['OpponentName'] = $row['UserName'];
        $Notify['OpponentAvatar'] = $row['ProfilePicture'];
    }
} else {
    $Notify['Check'] = 'No opponent found';
}
echo json_encode($Notify);
