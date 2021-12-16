<?php session_start();
include_once("../DatabaseConnection.php");
$UserID = $_SESSION['UserID'];
$GameID = $Opponent = $Notify = '';
$MoveString = $_POST['FEN'];
$Notify = array("Check" => "", "OpponentName" => "", "OpponentAvatar" => "");
$Query = Query("SELECT * FROM gamematch WHERE UserID != '$UserID' AND Waiting = '1'");
if (mysqli_num_rows($Query) == 1) {
    if ($row = mysqli_fetch_assoc($Query)) {
        $Opponent = $row['UserID'];
        $GameID = $row['GameID'];
        $_SESSION['GameID'] = $row['GameID'];
        Query("INSERT INTO gamematch(UserID,GameOpponent,GameID,GameColor,MoveString,Waiting) VALUES('$UserID','$Opponent','$GameID','black','$MoveString','0')");
        Query("UPDATE gamematch SET GameOpponent = '$UserID', Waiting = '0' WHERE GameID = '$GameID' AND UserID = $Opponent");
        $Result = Query("SELECT UserName, ProfilePicture FROM userinfo WHERE ID = '$Opponent'");
        $ROW = mysqli_fetch_assoc($Result);
        $Notify['OpponentAvatar'] = $ROW['ProfilePicture'];
        $Notify['OpponentName'] = $ROW['UserName'];
        $Notify['Check'] = 'Joined Game';
    }
}
echo json_encode($Notify);
