$(document).ajaxComplete(function () {
});

$(function () {
	init();
	NewGame();
	// newGameAjax();
});

function init() {
	InitColsRowsBrd();
	InitSq120To64();
	InitHashKeys();
	InitBoardVars();
	InitMvvLva();
	initBoardSquares();
	EvalInit();
	srch_thinking = BOOL.FALSE;
}

function InitColsRowsBrd() {
	var index = 0;
	var col = COLUMNS.COL_A;
	var row = ROWS.ROW_1;
	var sq = SQUARES.A1;
	var sq64 = 0;
	for (index = 0; index < BRD_SQ_NUM; ++index) {
		ColBrd[index] = SQUARES.OFFBOARD;
		RowBrd[index] = SQUARES.OFFBOARD;
	}
	for (row = ROWS.ROW_1; row <= ROWS.ROW_8; ++row) {
		for (col = COLUMNS.COL_A; col <= COLUMNS.COL_H; ++col) {
			sq = fromRCMxToNumArrSq(col, row);
			ColBrd[sq] = col;
			RowBrd[sq] = row;
		}
	}
}

function InitBoardVars() {
	var index = 0;
	for (index = 0; index < MAXGAMEMOVES; index++) {
		brd_history.push({
			move: NOMOVE,
			castlePerm: 0,
			enPas: 0,
			fiftyMove: 0,
			posKey: 0
		});
	}
	for (index = 0; index < PVENTRIES; index++) {
		brd_PvTable.push({
			move: NOMOVE,
			posKey: 0
		});
	}
}

function EvalInit() {
	var index = 0;
	for (index = 0; index < 10; ++index) {
		PawnRowsWhite[index] = 0;
		PawnRowsBlack[index] = 0;
	}
}

function InitHashKeys() {
	var index = 0;
	for (index = 0; index < 13 * 120; ++index) {
		PieceKeys[index] = RAND_32();
	}
	SideKey = RAND_32();
	for (index = 0; index < 16; ++index) {
		CastleKeys[index] = RAND_32();
	}
}

function InitSq120To64() {
	var index = 0;
	var col = COLUMNS.COL_A;
	var row = ROWS.ROW_1;
	var sq = SQUARES.A1;
	var sq64 = 0;
	for (index = 0; index < BRD_SQ_NUM; ++index) {
		Sq120ToSq64[index] = 65;
	}
	for (index = 0; index < 64; ++index) {
		Sq64ToSq120[index] = 120;
	}
	for (row = ROWS.ROW_1; row <= ROWS.ROW_8; ++row) {
		for (col = COLUMNS.COL_A; col <= COLUMNS.COL_H; ++col) {
			sq = fromRCMxToNumArrSq(col, row);
			Sq64ToSq120[sq64] = sq;
			Sq120ToSq64[sq] = sq64;
			sq64++;
		}
	}
}