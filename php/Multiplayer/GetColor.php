<?php session_start();
include_once("../DatabaseConnection.php");
$UserID = $_SESSION["UserID"];
$Color = '';
$Result = Query("SELECT * FROM gamematch WHERE UserID = '$UserID'");
if ($Row = mysqli_fetch_assoc($Result)) {
	$Color = $Row["GameColor"];
}
echo $Color;
