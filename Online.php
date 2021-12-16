<?php session_start();
$NotLoggedIn = $LoggedIn = $UserNameButton = $LogoutButton = '';
if (!isset($_SESSION['UserName']) || $_SESSION['UserName'] == 'You') {
	header("Location: home.php");
}
if ($_SESSION['UserName'] != "You") {
	$LoggedIn = 'style="display: none;"';
} else if ($_SESSION["UserName"] == "You") {
	$UserNameButton = $LogoutButton = 'style="display: none;"';
	$NotLoggedIn = 'style="display: none;"';
} ?>
<!DOCTYPE html>
<html>

<head>
	<meta charset="utf-8">
	<title>Play with others</title>
	<link href="css/SideBar/SideBar.css" rel="stylesheet" type="text/css">
	<link href="css/Computer/Computer-Style.css" rel="stylesheet" type="text/css">
	<link href="css/Board.css" rel="stylesheet" type="text/css">
	<link href="css/Multiplayer/Multiplayer-Style.css" rel="stylesheet" type="text/css">
</head>

<body>
	<div class="base-layout">
		<div class="base-sidebar">
			<a class="home-logo" href="Home.php">
				<img src="images/chess-logo.png">
			</a>
			<button <?php echo $LoggedIn ?>><a href="LoginRegister.php">Đăng Nhập</a></button>
			<button <?php echo $LoggedIn ?>><a href="LoginRegister.php">Đăng Kí</a></button>
			<button <?php echo $UserNameButton ?>><?php echo $_SESSION['UserName'] ?></button>
			<button <?php echo $LogoutButton ?> id="LogOut"><a href="php/LoginRegister/Logout.php">Đăng Xuất</a></button>
		</div>
		<div class="base-container">
			<div class="layout-sidebar sidebar">
				<div class="board-container">
					<div class="opponent">
						<img id="opponent-avatar" src="images/question-mark.png">
						<span class="small-name">Opponent</span>
					</div>
					<div id="Board">
						<div id="GameStatus">
							<div class="result">
							</div>
							<div class="display-players">
								<div class="opponent">
									<img id="opponent-avatar" src="images/question-mark.png">
									<span class="small-name">Opponent</span>
								</div>
								<i class="fas fa-ellipsis-h"></i>
								<div class="you">
									<img src="<?php echo $_SESSION['ProfilePicture'] ?>">
									<span><?php echo $_SESSION['UserName'] ?></span>
								</div>
							</div>
						</div>
					</div>
					<div class="you">
						<img src="<?php echo $_SESSION['ProfilePicture'] ?>">
						<span><?php echo $_SESSION['UserName'] ?></span>
					</div>
				</div>
				<div id="EngineOutput">
					<div class="pick-time">
						<div class="opponent-info">
							<h1>Play vs</h1>
							<img src="images/question-mark.png">
							<span>Opponent</span>
						</div>
						<div class="loading-container">
							<img src="images/waiting-for-opponent.gif">
							<span>Searching for player</span>
						</div>
						<div class="button-container">
							<button <?php echo $NotLoggedIn ?> class="join-room">Vào Phòng</button>
							<button <?php echo $NotLoggedIn ?> class="create-game">Tạo Phòng</button>
						</div>
					</div>
					<div class="ThinkingDiv" id="ThinkingImageDiv">
						<img class="computer-header" id="opponent-avatar" src="images/question-mark.png">
						<div class="thought-container"></div>
					</div>
					<div class="layout-move-list" id="move-list"></div>
					<div class="option-container">
						<button id="NewGameButton">Tái Đấu</button>
						<button id="DeleteGame">Thoát Game</button>
					</div>
				</div>
			</div>
		</div>
	</div>
	<script src="js/jquery-3.6.0.js"></script>
	<script type="text/javascript" src="js/GameBoard/defs.js"></script>
	<script type="text/javascript" src="js/GameBoard/io.js"></script>
	<script type="text/javascript" src="js/GameBoard/board.js"></script>
	<script type="text/javascript" src="js/GameBoard/movegen.js"></script>
	<script type="text/javascript" src="js/GameBoard/makemove.js"></script>
	<script type="text/javascript" src="js/GameBoard/perft.js"></script>
	<script type="text/javascript" src="js/GameBoard/evaluate.js"></script>
	<script type="text/javascript" src="js/GameBoard/pvtable.js"></script>
	<script type="text/javascript" src="js/GameBoard/search.js"></script>
	<script type="text/javascript" src="js/GameBoard/protocol.js"></script>
	<script type="text/javascript" src="js/Multiplayer/guiMultiPlayer.js"></script>
	<script type="text/javascript" src="js/GameBoard/main.js"></script>
	<script type="text/javascript" src="js/Options/Config.js"></script>
	<script type="text/javascript" src="js/Options/SoundPack.js"></script>
	<script></script>
</body>

</html>

<!-- <div id="CurrentFenDiv"><span id="currentFenSpan"></span></div> -->
<!-- <div id="FenInDiv">
	<input type="text" id="fenIn">
	<button type="button" id="SetFen">Set Position</button>
</div> -->