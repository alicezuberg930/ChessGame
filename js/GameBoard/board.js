var brd_side = COLOURS.WHITE;
var brd_pieces = new Array(BRD_SQ_NUM);
var brd_enPas = SQUARES.NO_SQ;
var brd_fiftyMove;
var brd_hisPly;
var brd_ply;
var brd_castlePerm;
var brd_posKey;
var brd_pceNum = new Array(13);
var brd_material = new Array(2);
var brd_pList = new Array(14 * 10);
var brd_history = [];
var brd_bookLines = [];
var brd_moveList = new Array(MAXDEPTH * MAXPOSITIONMOVES);
var brd_moveScores = new Array(MAXDEPTH * MAXPOSITIONMOVES);
var brd_moveListStart = new Array(MAXDEPTH);
var brd_PvTable = [];
var brd_PvArray = new Array(MAXDEPTH);
var brd_searchHistory = new Array(14 * BRD_SQ_NUM);
var brd_searchKillers = new Array(3 * MAXDEPTH);

function BoardToFen() {
	var fenStr = '';
	var row, col, sq, piece;
	var emptyCount = 0;
	for (row = ROWS.ROW_8; row >= ROWS.ROW_1; row--) {
		emptyCount = 0;
		for (col = COLUMNS.COL_A; col <= COLUMNS.COL_H; col++) {
			sq = fromRCMxToNumArrSq(col, row);
			piece = brd_pieces[sq];
			if (piece == PIECES.EMPTY) {
				emptyCount++;
			} else {
				if (emptyCount != 0) {
					fenStr += String.fromCharCode('0'.charCodeAt() + emptyCount);
				}
				emptyCount = 0;
				fenStr += PceChar[piece];
			}
		}
		if (emptyCount != 0) {
			fenStr += String.fromCharCode('0'.charCodeAt() + emptyCount);
		}
		if (row != ROWS.ROW_1) {
			fenStr += '/'
		} else {
			fenStr += ' ';
		}
	}
	fenStr += SideChar[brd_side] + ' ';
	if (brd_enPas == SQUARES.NO_SQ) {
		fenStr += '- '
	} else {
		fenStr += PrSq(brd_enPas) + ' ';
	}
	if (brd_castlePerm == 0) {
		fenStr += '- '
	} else {
		if (brd_castlePerm & CASTLEBIT.WKCA) fenStr += 'K';
		if (brd_castlePerm & CASTLEBIT.WQCA) fenStr += 'Q';
		if (brd_castlePerm & CASTLEBIT.BKCA) fenStr += 'k';
		if (brd_castlePerm & CASTLEBIT.BQCA) fenStr += 'q';
	}
	fenStr += ' ';
	fenStr += brd_fiftyMove;
	fenStr += ' ';
	var tempHalfMove = brd_hisPly;
	if (brd_side == COLOURS.BLACK) {
		tempHalfMove--;
	}
	fenStr += tempHalfMove / 2;
	return fenStr;
}

function CheckBoard() {
	var t_pceNum = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	var t_material = [0, 0];
	var sq64, t_piece, t_pce_num, sq120, colour, pcount;
	// check piece lists
	for (t_piece = PIECES.wP; t_piece <= PIECES.bK; ++t_piece) {
		for (t_pce_num = 0; t_pce_num < brd_pceNum[t_piece]; ++t_pce_num) {
			sq120 = brd_pList[PCEINDEX(t_piece, t_pce_num)];
			if (brd_pieces[sq120] != t_piece) {
				console.log('Error Pce Lists');
				return BOOL.FALSE;
			}
		}
	}
	for (sq64 = 0; sq64 < 64; ++sq64) {
		sq120 = SQ120(sq64);
		t_piece = brd_pieces[sq120];
		t_pceNum[t_piece]++;
		t_material[PieceCol[t_piece]] += PieceVal[t_piece];
	}
	for (t_piece = PIECES.wP; t_piece <= PIECES.bK; ++t_piece) {
		if (t_pceNum[t_piece] != brd_pceNum[t_piece]) {
			console.log('Error t_pceNum');
			return BOOL.FALSE;
		}
	}
	if (t_material[COLOURS.WHITE] != brd_material[COLOURS.WHITE] || t_material[COLOURS.BLACK] != brd_material[COLOURS.BLACK]) {
		console.log('Error t_material');
		return BOOL.FALSE;
	}
	if (brd_side != COLOURS.WHITE && brd_side != COLOURS.BLACK) {
		console.log('Error brd_side');
		return BOOL.FALSE;
	}
	if (GeneratePosKey() != brd_posKey) {
		console.log('Error brd_posKey');
		return BOOL.FALSE;
	}
	return BOOL.TRUE;
}

function printGameLine() {
	var moveNum = 0;
	var gameLine = "";
	for (moveNum = 0; moveNum < brd_hisPly; ++moveNum) {
		gameLine += PrMove(brd_history[moveNum].move) + "\n";
	}
	//console.log('Game Line: ' + gameLine);
	return $.trim(gameLine);
}

function LineMatch(BookLine, gameline) {
	//console.log("Matching " + gameline + " with " + BookLine + " len = " + gameline.length);
	for (var len = 0; len < gameline.length; ++len) {
		//console.log("Char Matching " + gameline[len] + " with " + BookLine[len]);
		if (len >= BookLine.length) { /*console.log('no match');*/ return BOOL.FALSE; }
		if (gameline[len] != BookLine[len]) { /*console.log('no match'); */return BOOL.FALSE; }
	}
	return BOOL.TRUE;
}

function BookMove() {
	var gameLine = printGameLine();
	var bookMoves = [];
	var lengthOfLineHack = gameLine.length;
	if (gameLine.length == 0) lengthOfLineHack--;
	for (var bookLineNum = 0; bookLineNum < brd_bookLines.length; ++bookLineNum) {
		if (LineMatch(brd_bookLines[bookLineNum], gameLine) == BOOL.TRUE) {
			var move = brd_bookLines[bookLineNum].substr(lengthOfLineHack + 1, 4);
			//console.log("Parsing book move:" + move);
			if (move.length == 4) {
				var from = SqFromAlg(move.substr(0, 2));
				var to = SqFromAlg(move.substr(2, 2));
				//console.log('from:'+from+' to:'+to);
				varInternalMove = ParseMove(from, to);
				//console.log("varInternalMove:" + PrMove(varInternalMove));
				bookMoves.push(varInternalMove);
			}
		}
	}
	console.log("Total + " + bookMoves.length + " moves in array");
	if (bookMoves.length == 0) return NOMOVE;
	var num = Math.floor(Math.random() * bookMoves.length);
	return bookMoves[num];
}

function PrintPceLists() {
	var piece, pceNum;
	for (piece = PIECES.wP; piece <= PIECES.bK; ++piece) {
		for (pceNum = 0; pceNum < brd_pceNum[piece]; ++pceNum) {
			console.log("Piece " + PceChar[piece] + " on " + PrSq(brd_pList[PCEINDEX(piece, pceNum)]));
		}
	}
}

function UpdateListsMaterial() {
	var piece, sq, index, colour;
	for (index = 0; index < BRD_SQ_NUM; ++index) {
		sq = index;
		piece = brd_pieces[index];
		if (piece != PIECES.OFFBOARD && piece != PIECES.EMPTY) {
			colour = PieceCol[piece];
			brd_material[colour] += PieceVal[piece];
			brd_pList[PCEINDEX(piece, brd_pceNum[piece])] = sq;
			brd_pceNum[piece]++;
		}
	}
}

function GeneratePosKey() {
	var sq = 0;
	var finalKey = 0;
	var piece = PIECES.EMPTY;
	for (sq = 0; sq < BRD_SQ_NUM; ++sq) { // gå igenom alla rutor
		piece = brd_pieces[sq]; // pjäs på en ruta
		if (piece != PIECES.EMPTY && piece != SQUARES.OFFBOARD) {	// om rutan inte är tom och inte utanför brädan, alltså pjäs existerar
			finalKey ^= PieceKeys[(piece * 120) + sq]; // "hasha in" denna nyckel i finalKey
		}
	}
	if (brd_side == COLOURS.WHITE) { //om vit
		finalKey ^= SideKey;
	}
	if (brd_enPas != SQUARES.NO_SQ) {		// om  enPas inte är en icke sq?
		finalKey ^= PieceKeys[brd_enPas];
	}
	finalKey ^= CastleKeys[brd_castlePerm];
	return finalKey;
}

function PrintBoard() {
	var sq, col, row, piece;
	console.log("\nGame Board:\n");
	for (row = ROWS.ROW_8; row >= ROWS.ROW_1; row--) { // för varje rad
		var line = ((row + 1) + "| "); // initiera line och sätt denna till rad nummer och ett streck
		for (col = COLUMNS.COL_A; col <= COLUMNS.COL_H; col++) { // kolumner
			sq = fromRCMxToNumArrSq(col, row);   // ta reda på NumArrSq för rutan
			piece = brd_pieces[sq]; // sätt piece till vad rutan innehåller
			line += (" " + PceChar[piece] + " "); // addera pjäs till raden som skrivs ut
		}
		console.log(line); // skriv ut raden
	}
	console.log("--------------------------------"); // efter rad loopen skriv streck
	var line = "   ";  // sätt ny line till "   "
	for (col = COLUMNS.COL_A; col <= COLUMNS.COL_H; col++) {
		line += (' ' + String.fromCharCode('a'.charCodeAt() + col) + ' ');
		/* addera bokstav och space till line 
		col representerar en siffra så 
		String.fromCharCode('a'.charCodeAt() + 0) blir "a"
		String.fromCharCode('a'.charCodeAt() + 1) blir "b"
		*/
	}
	console.log(line);
	console.log("side:" + SideChar[brd_side]);
	// SideChar är definierad i defs.js som SideChar = "wb-"; brd_side sätts i ParseFen funktionen
	console.log("enPas:" + brd_enPas);
	line = "";
	if (brd_castlePerm & CASTLEBIT.WKCA) line += 'K';
	if (brd_castlePerm & CASTLEBIT.WQCA) line += 'Q';
	if (brd_castlePerm & CASTLEBIT.BKCA) line += 'k';
	if (brd_castlePerm & CASTLEBIT.BQCA) line += 'q';

	console.log("castle:" + line);
	console.log("key:" + brd_posKey.toString(16));
	//PrintPceLists();
}

function ResetBoard() {

	var index = 0;

	for (index = 0; index < BRD_SQ_NUM; ++index) {
		brd_pieces[index] = SQUARES.OFFBOARD;
	}

	for (index = 0; index < 64; ++index) {
		brd_pieces[SQ120(index)] = PIECES.EMPTY;
	}

	for (index = 0; index < 14 * 120; ++index) {
		brd_pList[index] = PIECES.EMPTY;
	}

	for (index = 0; index < 2; ++index) {
		brd_material[index] = 0;
	}

	for (index = 0; index < 13; ++index) {
		brd_pceNum[index] = 0;
	}

	brd_side = COLOURS.BOTH;
	brd_enPas = SQUARES.NO_SQ;
	brd_fiftyMove = 0;
	brd_ply = 0;
	brd_hisPly = 0;
	brd_castlePerm = 0;
	brd_posKey = 0;
	brd_moveListStart[brd_ply] = 0;

}

function ParseFen(fen) {
	var row = ROWS.ROW_8;
	var col = COLUMNS.COL_A;
	var piece = 0;
	var count = 0;
	var i = 0;
	var sq64 = 0;
	var sq120 = 0;
	var fenCnt = 0;
	ResetBoard();
	while ((row >= ROWS.ROW_1) && fenCnt < fen.length) {
		count = 1;
		switch (fen[fenCnt]) {
			case 'p': piece = PIECES.bP; break;
			case 'r': piece = PIECES.bR; break;
			case 'n': piece = PIECES.bN; break;
			case 'b': piece = PIECES.bB; break;
			case 'k': piece = PIECES.bK; break;
			case 'q': piece = PIECES.bQ; break;
			case 'P': piece = PIECES.wP; break;
			case 'R': piece = PIECES.wR; break;
			case 'N': piece = PIECES.wN; break;
			case 'B': piece = PIECES.wB; break;
			case 'K': piece = PIECES.wK; break;
			case 'Q': piece = PIECES.wQ; break;
			case '1':
			case '2':
			case '3':
			case '4':
			case '5':
			case '6':
			case '7':
			case '8':
				piece = PIECES.EMPTY;
				count = fen[fenCnt].charCodeAt() - '0'.charCodeAt();
				break;
			case '/':
			case ' ':
				row--;
				col = COLUMNS.COL_A;
				fenCnt++;
				continue;
			default:
				printf("FEN error \n");
				return;
		}
		for (i = 0; i < count; i++) {
			sq64 = row * 8 + col;
			sq120 = SQ120(sq64);
			if (piece != PIECES.EMPTY) {
				brd_pieces[sq120] = piece;
			}
			col++;
		}
		fenCnt++;
	}
	brd_side = (fen[fenCnt] == 'w') ? COLOURS.WHITE : COLOURS.BLACK;
	fenCnt += 2;
	for (i = 0; i < 4; i++) {
		if (fen[fenCnt] == ' ') {
			break;
		}
		switch (fen[fenCnt]) {
			case 'K': brd_castlePerm |= CASTLEBIT.WKCA; break;
			case 'Q': brd_castlePerm |= CASTLEBIT.WQCA; break;
			case 'k': brd_castlePerm |= CASTLEBIT.BKCA; break;
			case 'q': brd_castlePerm |= CASTLEBIT.BQCA; break;
			default: break;
		}
		fenCnt++;
	}
	fenCnt++;
	if (fen[fenCnt] != '-') {
		col = fen[fenCnt].charCodeAt() - 'a'.charCodeAt();
		row = fen[fenCnt + 1].charCodeAt() - '1'.charCodeAt();
		console.log("fen[fenCnt]:" + fen[fenCnt] + " col:" + col + " row:" + row);
		brd_enPas = fromRCMxToNumArrSq(col, row);
	}
	brd_posKey = GeneratePosKey();
	UpdateListsMaterial();
}

function SqAttacked(sq, side) {
	var pce;
	var t_sq;
	var index;
	if (side == COLOURS.WHITE) {
		if (brd_pieces[sq - 11] == PIECES.wP || brd_pieces[sq - 9] == PIECES.wP) {
			return BOOL.TRUE;
		}
	} else {
		if (brd_pieces[sq + 11] == PIECES.bP || brd_pieces[sq + 9] == PIECES.bP) {
			return BOOL.TRUE;
		}
	}
	for (index = 0; index < 8; ++index) {
		pce = brd_pieces[sq + KnDir[index]];
		if (pce != SQUARES.OFFBOARD && PieceKnight[pce] == BOOL.TRUE && PieceCol[pce] == side) {
			return BOOL.TRUE;
		}
	}
	for (index = 0; index < 4; ++index) {
		dir = RkDir[index];
		t_sq = sq + dir;
		pce = brd_pieces[t_sq];
		while (pce != SQUARES.OFFBOARD) {
			if (pce != PIECES.EMPTY) {
				if (PieceRookQueen[pce] == BOOL.TRUE && PieceCol[pce] == side) {
					return BOOL.TRUE;
				}
				break;
			}
			t_sq += dir;
			pce = brd_pieces[t_sq];
		}
	}
	for (index = 0; index < 4; ++index) {
		dir = BiDir[index];
		t_sq = sq + dir;
		pce = brd_pieces[t_sq];
		while (pce != SQUARES.OFFBOARD) {
			if (pce != PIECES.EMPTY) {
				if (PieceBishopQueen[pce] == BOOL.TRUE && PieceCol[pce] == side) {
					return BOOL.TRUE;
				}
				break;
			}
			t_sq += dir;
			pce = brd_pieces[t_sq];
		}
	}
	for (index = 0; index < 8; ++index) {
		pce = brd_pieces[sq + KiDir[index]];
		if (pce != SQUARES.OFFBOARD && PieceKing[pce] == BOOL.TRUE && PieceCol[pce] == side) {
			return BOOL.TRUE;
		}
	}
	return BOOL.FALSE;
}

function PrintSqAttacked() {
	var sq, col, row, piece;
	console.log("\nAttacked:\n");
	for (row = ROWS.ROW_8; row >= ROWS.ROW_1; row--) {
		var line = ((row + 1) + "  ");
		for (col = COLUMNS.COL_A; col <= COLUMNS.COL_H; col++) {
			sq = fromRCMxToNumArrSq(col, row);
			if (SqAttacked(sq, COLOURS.BLACK) == BOOL.TRUE) piece = "X";
			else piece = "-";
			line += (" " + piece + " ");
		}
		console.log(line);
	}
}