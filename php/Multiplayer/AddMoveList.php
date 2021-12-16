<?php session_start();
require_once("../DatabaseConnection.php");
$GameID = $_SESSION['GameID'];
$MoveNo = $_POST['MoveNo'];
$MoveFrom = $_POST['MoveFrom'];
$MoveTo = $_POST['MoveTo'];
$CapturedPiece = $_POST['CapturedPiece'];
Query("INSERT INTO movelist(GameID, MoveNo, MoveFrom, MoveTo, CapturedPiece) VALUES('$GameID','$MoveNo','$MoveFrom','$MoveTo','$CapturedPiece')");