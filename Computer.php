<?php session_start();
$LoginButton = $RegisterButton = $UserNameButton = $LogoutButton = '';
if (!isset($_SESSION['UserName']) || $_SESSION['UserName'] == 'You') {
	$_SESSION['UserName'] = "You";
	$_SESSION['ProfilePicture'] = "images/Default.svg";
	$LoginButton = $RegisterButton = 'style="display: block;"';
	$UserNameButton = $LogoutButton = 'style="display: none;"';
} else if ($_SESSION['UserName'] != "You") {
	$LoginButton = $RegisterButton = 'style="display: none;"';
} ?>
<!DOCTYPE html>
<html>

<head>
	<meta charset="utf-8">
	<title>Play with computer</title>
	<link href="css/SideBar/SideBar.css" rel="stylesheet" type="text/css">
	<link href="css/Computer/Computer-Style.css" rel="stylesheet" type="text/css">
	<link href="css/Board.css" rel="stylesheet" type="text/css">
	<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.4.1/css/all.css">
</head>

<body>
	<div class="base-layout">
		<div class="base-sidebar">
			<a class="home-logo" href="Home.php">
				<img src="images/chess-logo.png">
			</a>
			<button <?php echo $LoginButton ?>><a href="LoginRegister.php">Đăng Nhập</a></button>
			<button <?php echo $RegisterButton ?>><a href="LoginRegister.php">Đăng Kí</a></button>
			<button <?php echo $UserNameButton ?>><?php echo $_SESSION['UserName'] ?></button>
			<button <?php echo $LogoutButton ?> id="LogOut"><a href="php/LoginRegister/Logout.php">Đăng Xuất</a></button>
		</div>
		<div class="base-container">
			<div class="layout-sidebar sidebar">
				<div class="board-container">
					<div class="opponent">
						<img src="images/computer.png">
						<span>Máy Tính</span>
					</div>
					<div id="Board">
						<div id="GameStatus">
							<div class="result">
							</div>
							<div class="display-players">
								<div class="opponent">
									<img src="images/computer.png">
									<span>Máy Tính</span>
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
							<h1>Đánh Với</h1>
							<img src="images/computer.png">
							<span>Máy Tính</span>
						</div>
						<select id="ThinkTimeChoice">
							<option value="1">1</option>
							<option value="2">2</option>
							<option value="3">3</option>
							<option value="4">4</option>
							<option value="5">5</option>
							<option value="6">6</option>
							<option value="7">7</option>
							<option value="8">8</option>
							<option value="9">9</option>
							<option value="10">10</option>
							<option value="none" selected>Chọn cấp độ</option>
						</select>
						<span id="warning">Vui lòng chọn cấp độ trước khi chơi</span>
						<button class="play">Chơi</button>
					</div>

					<div class="ThinkingDiv" id="ThinkingImageDiv">
						<img class="computer-header" src="images/computer.png">
						<div class="thought-container"></div>
					</div>
					<div class="layout-move-list" id="move-list"></div>
					<div class="option-container">
						<button id="FlipButton">Lật Ngược</button>
						<button id="TakeButton">Đi Lại</button>
						<button id="NewGameButton">Game Mới</button>
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
	<script type="text/javascript" src="js/GameBoard/gui.js"></script>
	<script type="text/javascript" src="js/GameBoard/main.js"></script>
	<script type="text/javascript" src="js/Options/Config.js"></script>
	<script type="text/javascript" src="js/Options/SoundPack.js"></script>
</body>

</html>

<!-- <span id="DepthOut">Depth:</span> -->
<!-- <span id="ScoreOut">Score:</span> -->
<!-- <span id="NodesOut">Nodes:</span> -->
<!-- <span id="OrderingOut">Ordering:</span> -->
<!-- <span id="TimeOut">Time:</span> -->
<!-- <button type="button" id="SearchButton">Move Now</button> -->
<!-- <div id="FenInDiv"> 
		<input type="text" id="fenIn">
		<button type="button" id="SetFen">Set Position</button>
	</div> -->