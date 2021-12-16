<?php session_start();
include_once("../DatabaseConnection.php");
$GameID = $_SESSION["GameID"];
Query("DELETE FROM gamematch WHERE GameID = '$GameID'");
Query("DELETE FROM movelist WHERE GameID = '$GameID'");
$_SESSION['GameID'] = '';