<?php session_start();
include_once("../DatabaseConnection.php");
$GameID = $_SESSION['GameID'];
$MoveString = '';
$Result = Query("SELECT * FROM gamematch WHERE GameID='$GameID'");
if ($row = mysqli_fetch_assoc($Result)) {
	$MoveString = $row['MoveString'];
}
echo $MoveString;
