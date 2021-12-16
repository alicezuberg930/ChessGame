<?php session_start();
require_once("../DatabaseConnection.php");
$UserID = $_SESSION['UserID'];
$GameID = bin2hex(random_bytes(4));
$_SESSION['GameID'] = $GameID;
$MoveString = $_POST['FEN'];
$Query = Query("INSERT INTO gamematch(UserID,GameID,GameColor,MoveString,Waiting) VALUES('$UserID','$GameID','white','$MoveString','1')");
if ($Query) {
    echo "Game created";
} else {
    echo "Game failed to create";
}
