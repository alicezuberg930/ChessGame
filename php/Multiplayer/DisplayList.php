<?php session_start();
require_once("../DatabaseConnection.php");
$GameID = $_SESSION['GameID'];
$result = query("SELECT * FROM movelist WHERE GameID = '$GameID' ORDER BY MoveNo ASC");
$MoveString = $Color = '';
while ($row = mysqli_fetch_assoc($result)) {
    if ($row['MoveNo'] % 2 == 0) {
        $Color = "Light";
    } else {
        $Color = "Dark";
    }
    $MoveString .= '<div class="usermove '  . $Color . '">
        <span>' . $row['MoveNo'] . '.</span>
        <span>'  . $row['MoveFrom'] . '</span>
        <span>' . $row['CapturedPiece'] . $row['MoveTo'] . '</span>
    </div>';
}
echo $MoveString;
