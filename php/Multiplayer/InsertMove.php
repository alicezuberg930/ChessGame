<?php session_start();
include_once("../DatabaseConnection.php");
$GameID = $_SESSION['GameID'];
$MoveString = $_POST['MoveString'];
Query("UPDATE gamematch SET MoveString='$MoveString' WHERE GameID='$GameID'");