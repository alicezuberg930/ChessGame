var UserMove = {};
UserMove.from = SQUARES.NO_SQ;
UserMove.to = SQUARES.NO_SQ;
var MirrorCols = [COLUMNS.COL_H, COLUMNS.COL_G, COLUMNS.COL_F, COLUMNS.COL_E, COLUMNS.COL_D, COLUMNS.COL_C, COLUMNS.COL_B, COLUMNS.COL_A];
var MirrorRows = [ROWS.ROW_8, ROWS.ROW_7, ROWS.ROW_6, ROWS.ROW_5, ROWS.ROW_4, ROWS.ROW_3, ROWS.ROW_2, ROWS.ROW_1];

function MIRROR120(sq) {
	var col = MirrorCols[ColBrd[sq]];
	var row = MirrorRows[RowBrd[sq]];
	return fromRCMxToNumArrSq(col, row);
}

function CheckResult() {
	if (brd_fiftyMove > 100) {
		setTimeout(() => {
			$("#GameStatus").css("display", "block");
			$(".result").append("<h1>GAME DRAWN</h1> <span>50 Move rule</span>");
			end.play();
		}, 1000);
		return BOOL.TRUE;
	}
	if (ThreeFoldRep() >= 2) {
		setTimeout(() => {
			$("#GameStatus").css("display", "block");
			$(".result").append("<h1>GAME DRAWN</h1> <span>3-fold repetition</span>");
			end.play();
		}, 1000);
		return BOOL.TRUE;
	}
	if (DrawMaterial() == BOOL.TRUE) {
		setTimeout(() => {
			$("#GameStatus").css("display", "block");
			$(".result").append("<h1>GAME DRAWN</h1> <span>insufficient material to mate</span>");
			end.play();
		}, 1000);
		return BOOL.TRUE;
	}
	GenerateMoves();
	var MoveNum = 0;
	var found = 0;
	for (MoveNum = brd_moveListStart[brd_ply]; MoveNum < brd_moveListStart[brd_ply + 1]; ++MoveNum) {
		if (MakeMove(brd_moveList[MoveNum]) == BOOL.FALSE) {
			continue;
		}
		found++;
		TakeMove();
		break;
	}
	$("#currentFenSpan").text(BoardToFen());
	if (found != 0) return BOOL.FALSE;
	var InCheck = SqAttacked(brd_pList[PCEINDEX(Kings[brd_side], 0)], brd_side ^ 1);
	if (InCheck == BOOL.TRUE) {
		if (brd_side == COLOURS.WHITE) {
			setTimeout(() => {
				$("#GameStatus").css("display", "block");
				$(".result").append("<h1>GAME OVER</h1> <span>black checkmates</span>");
				end.play();
			}, 1000);
		} else {
			setTimeout(() => {
				$("#GameStatus").css("display", "block");
				$(".result").append("<h1>GAME OVER</h1> <span>white checkmates</span>");
				end.play();
			}, 1000);
		}
	} else {
		setTimeout(() => {
			$("#GameStatus").css("display", "block");
			$(".result").append("<h1>GAME DRAWN</h1> <span>stalemate</span>");
			end.play();
		}, 1000);
		return BOOL.TRUE;
	}
	return BOOL.FALSE;
}

function ClickedSquare(pageX, pageY) {
	var position = $("#Board").position();
	console.log("Piece clicked at " + pageX + "," + pageY + " board top:" + position.top + " board left:" + position.left);
	var workedX = Math.floor(position.left);
	var workedY = Math.floor(position.top);
	var pageX = Math.floor(pageX);
	var pageY = Math.floor(pageY);
	var col = Math.floor((pageX - workedX) / 60);
	var row = 7 - Math.floor((pageY - workedY) / 60);
	var sq = fromRCMxToNumArrSq(col, row);
	if (GameController.BoardFlipped == BOOL.TRUE) {
		sq = MIRROR120(sq);
	}
	console.log("WorkedX: " + workedX + " WorkedY:" + workedY + " col:" + col + " row:" + row);
	console.log("clicked:" + PrSq(sq));
	SetSqSelected(sq);
	return sq;
}

function CheckAndSet() {
	if (CheckResult() != BOOL.TRUE) {
		GameController.GameOver = BOOL.FALSE;
		$("#GameStatus").css("display", "none");
		$(".result").text('');
	} else {
		GameController.GameOver = BOOL.TRUE;
		GameController.GameSaved = BOOL.TRUE;
	}
	$("#currentFenSpan").text(BoardToFen());
}

function UserColor() {
	var MoveString = BoardToFen();
	$.ajax({
		type: 'get',
		url: 'php/Multiplayer/GetColor.php',
		success: function (data) {
			if (data == "white") {
				Color = 0;
			} else {
				Color = 1;
			}
		}
	});
	return Color;
}

function FlipBoard() {
	$.ajax({
		type: 'get',
		url: 'php/Multiplayer/GetColor.php',
		success: function (data) {
			if (data == "white") {
				$usercolor = 0;
			} else {
				GameController.BoardFlipped ^= 1;
				SetInitialBoardPieces();
				$usercolor = 1;
			}
		}
	});
}

let i = 0;
function MakeUserMove2() {
	let PlayerColor = UserColor();
	if (UserMove.from != SQUARES.NO_SQ && UserMove.to != SQUARES.NO_SQ) {
		console.log("User Move:" + PrSq(UserMove.from) + " to " + PrSq(UserMove.to));
		var parsed = ParseMove(UserMove.from, UserMove.to);
		DeselectSq(UserMove.from);
		DeselectSq(UserMove.to);
		if (parsed != NOMOVE && ((PlayerColor == 0 && brd_side == 0) || (PlayerColor == 1 && brd_side == 1))) {
			MakeMove(parsed);
			MoveGUIPiece(parsed);
			CheckAndSet();
			GameController.PlayerSide = brd_side;
			MoveEffect.play();
			DivColor = "Dark";
			if (i % 2 == 0) {
				DivColor = "Light";
			}
			AddMoveList(i++, PrSq(UserMove.from), PrSq(UserMove.to), capturepce);
		} else {
			if (parsed != NOMOVE) {
				GameController.PlayerSide = brd_side;
			}
		}
		capturepce = '';
		UserMove.from = SQUARES.NO_SQ;
		UserMove.to = SQUARES.NO_SQ;
		var MoveString = BoardToFen();
		$.ajax({
			type: 'post',
			url: 'php/Multiplayer/InsertMove.php',
			data: { MoveString: MoveString },
			success: function (data) {
				console.log(data);
			}
		});
	}
}

function AddMoveList(MoveNo, MoveFrom, MoveTo, CapturedPiece) {
	$.ajax({
		method: 'post',
		url: 'php/Multiplayer/AddMoveList.php',
		data: { MoveNo: MoveNo, MoveFrom: MoveFrom, MoveTo: MoveTo, CapturedPiece: CapturedPiece },
		success: function (data) {
			$("#move-list").html(data);
		}
	});
}

let LoadInterval;
function LoadMove() {
	$.ajax({
		method: 'get',
		url: 'php/Multiplayer/DisplayMove.php',
		success: function (data) {
			if (data != "") {
				ParseFen(data);
				SetInitialBoardPieces();
				GameController.PlayerSide = brd_side;
				CheckAndSet();
				EvalPosition();
				console.log(data);
				if (data === START_FEN) {
					$("#move-list").html('');
				}
			}
			if (data == '') {
				if (brd_side == COLOURS.WHITE) {
					setTimeout(() => {
						$("#GameStatus").css("display", "block");
						$(".result").append("<h1>You Won</h1> <span>white left</span>");
						end.play();
					}, 1000);
				} else {
					setTimeout(() => {
						$("#GameStatus").css("display", "block");
						$(".result").append("<h1>You Won</h1> <span>black left</span>");
						end.play();
					}, 1000);
				}
				clearInterval(LoadInterval);
			}
		}
	});
}

$(document).on('click', '.Piece', (e) => {
	if (GameController.PlayerSide == brd_side) {
		if (UserMove.from == SQUARES.NO_SQ)
			UserMove.from = ClickedSquare(e.pageX, e.pageY);
		else
			UserMove.to = ClickedSquare(e.pageX, e.pageY);
		MakeUserMove2();
	}
});

$(document).on('click', '.Square', (e) => {
	if (GameController.PlayerSide == brd_side && UserMove.from != SQUARES.NO_SQ) {
		UserMove.to = ClickedSquare(e.pageX, e.pageY);
		MakeUserMove2();
	}
});

let capturepce = '';
function RemoveGUIPiece(sq) {
	console.log("remove on:" + PrSq(sq));
	$(".Piece").each(function (index) {
		// console.log( "Picture:" + index + ": " + $(this).position().top + "," + $(this).position().left );
		if ((RowBrd[sq] == 7 - Math.round($(this).position().top / 60)) && (ColBrd[sq] == Math.round($(this).position().left / 60))) {
			// console.log( "Picture:" + index + ": " + $(this).position().top + "," + $(this).position().left );	
			capturepce = '<img src="' + ($(this).attr('src')) + '">';
			$(this).remove();
		}
	});
}

function AddGUIPiece(sq, pce) {
	var rank = RanksBrd[sq];
	var file = FilesBrd[sq];
	var rankName = "rank" + (rank + 1);
	var fileName = "file" + (file + 1);
	pieceFileName = "images/" + SideChar[PieceCol[pce]] + PceChar[pce].toUpperCase() + ".png";
	imageString = "<image src=\"" + pieceFileName + "\" class=\"Piece clickElement " + rankName + " " + fileName + "\"/>";
	$("#Board").append(imageString);
}


function MoveGUIPiece(move) {
	var from = FROMSQ(move);
	var to = TOSQ(move);
	var flippedFrom = from;
	var flippedTo = to;
	var epWhite = -10;
	var epBlack = 10;
	if (GameController.BoardFlipped == BOOL.TRUE) {
		flippedFrom = MIRROR120(from);
		flippedTo = MIRROR120(to);
		epWhite = 10;
		epBlack = -10;
	}
	if (move & MFLAGEP) {
		var epRemove;
		if (brd_side == COLOURS.BLACK) {
			epRemove = flippedTo + epWhite;
		} else {
			epRemove = flippedTo + epBlack;
		}
		RemoveGUIPiece(epRemove);
		RemovePiece.play();
	} else if (CAPTURED(move)) {
		RemoveGUIPiece(flippedTo);
		RemovePiece.play();
	}
	var row = RowBrd[flippedTo];
	var col = ColBrd[flippedTo];
	var rowName = "row" + (row + 1);
	var colName = "col" + (col + 1);
	$(".Piece").each(function (index) {
		//console.log( "Picture:" + index + ": " + $(this).position().top + "," + $(this).position().left );
		if ((RowBrd[flippedFrom] == 7 - Math.round($(this).position().top / 60)) && (ColBrd[flippedFrom] == Math.round($(this).position().left / 60))) {
			//console.log("Setting pic ff:" + ColBrd[from] + " rf:" + RowBrd[from] + " tf:" + ColBrd[to] + " rt:" + RowBrd[to]);
			$(this).removeClass();
			$(this).addClass("Piece clickElement " + rowName + " " + colName);
		}
	});
	if (move & MFLAGCA) {
		if (GameController.BoardFlipped == BOOL.TRUE) {
			switch (to) {
				case SQUARES.G1: RemoveGUIPiece(MIRROR120(SQUARES.H1)); AddGUIPiece(MIRROR120(SQUARES.F1), PIECES.wR); break;
				case SQUARES.C1: RemoveGUIPiece(MIRROR120(SQUARES.A1)); AddGUIPiece(MIRROR120(SQUARES.D1), PIECES.wR); break;
				case SQUARES.G8: RemoveGUIPiece(MIRROR120(SQUARES.H8)); AddGUIPiece(MIRROR120(SQUARES.F8), PIECES.bR); break;
				case SQUARES.C8: RemoveGUIPiece(MIRROR120(SQUARES.A8)); AddGUIPiece(MIRROR120(SQUARES.D8), PIECES.bR); break;
			}
		} else {
			switch (to) {
				case SQUARES.G1: RemoveGUIPiece(SQUARES.H1); AddGUIPiece(SQUARES.F1, PIECES.wR); break;
				case SQUARES.C1: RemoveGUIPiece(SQUARES.A1); AddGUIPiece(SQUARES.D1, PIECES.wR); break;
				case SQUARES.G8: RemoveGUIPiece(SQUARES.H8); AddGUIPiece(SQUARES.F8, PIECES.bR); break;
				case SQUARES.C8: RemoveGUIPiece(SQUARES.A8); AddGUIPiece(SQUARES.D8, PIECES.bR); break;
			}
		}
	}
	var prom = PROMOTED(move);
	console.log("PromPce:" + prom);
	if (prom != PIECES.EMPTY) {
		console.log("prom removing from " + PrSq(flippedTo));
		RemoveGUIPiece(flippedTo);
		AddGUIPiece(flippedTo, prom);
		PromotePawn.play();
	}
	printGameLine();
}

function DeselectSq(sq) {
	if (GameController.BoardFlipped == BOOL.TRUE) {
		sq = MIRROR120(sq);
	}
	$(".Square").each(function (index) {
		if ((RowBrd[sq] == 7 - Math.round($(this).position().top / 60)) && (ColBrd[sq] == Math.round($(this).position().left / 60))) {
			$(this).removeClass('SqSelected');
		}
	});
}

function SetSqSelected(sq) {
	if (GameController.BoardFlipped == BOOL.TRUE) {
		sq = MIRROR120(sq);
	}
	$(".Square").each(function (index) {
		//console.log("Looking Sq Selected RowBrd[sq] " + RowBrd[sq] + " ColBrd[sq] " + ColBrd[sq] + " position " + Math.round($(this).position().left/60) + "," + Math.round($(this).position().top/60));	
		if ((RowBrd[sq] == 7 - Math.round($(this).position().top / 60)) && (ColBrd[sq] == Math.round($(this).position().left / 60))) {
			//console.log("Setting Selected Sq");
			$(this).addClass('SqSelected');
		}
	});
}

function NewGame() {
	ParseFen(START_FEN);
	PrintBoard();
	SetInitialBoardPieces();
	GameController.PlayerSide = brd_side;
	CheckAndSet();
	GameController.GameSaved = BOOL.FALSE;
}

function initBoardSquares() {
	var light = 0;
	var rowName;
	var colName;
	var divString;
	var lightString;
	var lastLight = 0;
	for (rowIter = ROWS.ROW_8; rowIter >= ROWS.ROW_1; rowIter--) {
		light = lastLight ^ 1;
		lastLight ^= 1;
		rowName = "row" + (rowIter + 1);
		for (colIter = COLUMNS.COL_A; colIter <= COLUMNS.COL_H; colIter++) {
			colName = "col" + (colIter + 1);
			if (light == 0) lightString = "Light";
			else lightString = "Dark";
			divString = "<div class=\"Square clickElement " + rowName + " " + colName + " " + lightString + "\"/>";
			light ^= 1;
			$("#Board").append(divString);
		}
	}
}

function ClearAllPieces() {
	$(".Piece").remove();
}

function SetInitialBoardPieces() {
	var sq, sq120, col, row, rowName, colName, imageString, pieceColName, pce;
	ClearAllPieces();
	for (sq = 0; sq < 64; ++sq) {
		sq120 = SQ120(sq);
		pce = brd_pieces[sq120];
		if (GameController.BoardFlipped == BOOL.TRUE) {
			sq120 = MIRROR120(sq120);
		}
		col = ColBrd[sq120];
		row = RowBrd[sq120];
		if (pce >= PIECES.wP && pce <= PIECES.bK) {
			rowName = "row" + (row + 1);
			colName = "col" + (col + 1);
			pieceColName = "images/" + SideChar[PieceCol[pce]] + PceChar[pce].toUpperCase() + ".png";
			imageString = "<image src=\"" + pieceColName + "\" class=\"Piece " + rowName + " " + colName + "\"/>";
			$("#Board").append(imageString);
		}
	}
}

$("#NewGameButton").click(function () {
	NewGame();
	$.ajax({
		type: 'post',
		url: 'php/Multiplayer/InsertMove.php',
		data: { MoveString: START_FEN },
		success: function (data) {
			console.log(data);
		}
	});
	$.ajax({
		type: 'post',
		url: 'php/Multiplayer/DeleteMoveList.php',
		data: { MoveString: START_FEN },
		success: function (data) {
			console.log(data);
		}
	});
});

$("#SetFen").click(function () {
	var fenStr = $("#fenIn").val();
	ParseFen(fenStr);
	SetInitialBoardPieces();
	GameController.PlayerSide = brd_side;
	CheckAndSet();
	EvalPosition();
});

$("#TakeButton").click(function () {
	if (brd_hisPly > 0) {
		TakeMove();
		brd_ply = 0;
		SetInitialBoardPieces();
		$("#currentFenSpan").text(BoardToFen());
		$.ajax({
			type: 'POST',
			url: 'php/Multiplayer/InsertMove.php',
			data: { MoveString: BoardToFen() },
			success: function (data) {
				ParseFen(BoardToFen());
			}
		});
	}
});

$("#FlipButton").click(function () {
	GameController.BoardFlipped ^= 1;
	SetInitialBoardPieces();
});

$("#DeleteGame").click(function () {
	$.ajax({
		method: 'get',
		url: 'php/Multiplayer/DeleteGame.php',
		success: function (data) {
			console.log(data);
			window.location.reload();
		}
	});
});

$("#Board").click(() => {
	$("#GameStatus").css("display", "none");
});

let CheckMatchInterval, WaitInterval;
$(".join-room").click(function () {
	$(".loading-container").css("visibility", "visible");
	CheckMatchInterval = setInterval(CheckMatch, 1500);
});

$(".create-game").click(function () {
	$(".loading-container").css("visibility", "visible");
	CreateMatch();
	WaitInterval = setInterval(WaitForPlayer, 1500);
});

function CheckMatch() {
	$.ajax({
		method: 'post',
		url: 'php/Multiplayer/CheckGame.php',
		dataType: 'json',
		data: {
			FEN: START_FEN
		},
		success: function (data) {
			console.log(data)
			if (data.Check == "Joined Game") {
				start.play();
				FlipBoard();
				$(".small-name").text(data.OpponentName);
				$("#Board").css("pointer-events", "auto");
				$(".layout-move-list").css("display", "block");
				$(".option-container").css("display", "flex");
				$(".pick-time").css("display", "none");
				$(".ThinkingDiv").css("display", "flex");
				$("#opponent-avatar").attr("src", data.OpponentAvatar);
				clearInterval(CheckMatchInterval);
				LoadInterval = setInterval(LoadMove, 1000);
			}
		}
	});
}

function CreateMatch() {
	$.ajax({
		method: 'post',
		url: 'php/Multiplayer/CreateMatch.php',
		data: {
			FEN: START_FEN
		},
		success: function (data) {
			console.log(data);
		}
	});
}

function WaitForPlayer() {
	$.ajax({
		method: 'get',
		url: 'php/Multiplayer/WaitForPlayer.php',
		dataType: 'json',
		success: function (data) {
			console.log(data)
			if (data.Check == "Opponent found") {
				start.play();
				$(".small-name").text(data.OpponentName);
				$("#Board").css("pointer-events", "auto");
				$(".layout-move-list").css("display", "block");
				$(".option-container").css("display", "flex");
				$(".pick-time").css("display", "none");
				$(".ThinkingDiv").css("display", "flex");
				$("#opponent-avatar").attr("src", data.OpponentAvatar);
				clearInterval(WaitInterval);
				LoadInterval = setInterval(LoadMove, 1000);
			}
		}
	});
}