//minesweeper game by 101computing.net - www.101computing.et/minesweeper-in-javascript/
var grid = document.getElementById("grid");
var testMode = true; //Turn this variable to true to see where the mines are
let params = {
    Nrows: 20,
    Ncolumns: 10,
    Nmines: 30
}

generateGrid();

function generateGrid() {
	//generate grid
	grid.innerHTML = "";
	for (var i = 0; i < params.Nrows; i++) {
		row = grid.insertRow(i);
		for (var j = 0; j < params.Ncolumns; j++) {
			cell = row.insertCell(j);
			cell.onclick = function () {
				clickCell(this);
			};
			var mine = document.createAttribute("data-mine");
			mine.value = "false";
			cell.setAttributeNode(mine);
		}
	}
	addMines();
}

function addMines() {
	//Add mines randomly
	for (var i = 0; i < params.Nmines; i++) { //LESS MINES THAN EXPECTED
		var row = Math.floor(Math.random() * params.Nrows);
		var col = Math.floor(Math.random() * params.Ncolumns);
		var cell = grid.rows[row].cells[col];
		cell.setAttribute("data-mine", "true");
		if (testMode) cell.innerHTML = "X";
	}
}

function revealMines() {
	//Highlight all mines in red
	for (var i = 0; i < 10; i++) {
		for (var j = 0; j < 10; j++) {
			var cell = grid.rows[i].cells[j];
			if (cell.getAttribute("data-mine") == "true") cell.className = "mine";
		}
	}
}

function checkLevelCompletion() {
	var levelComplete = true;
	for (var i = 0; i < 10; i++) {
		for (var j = 0; j < 10; j++) {
			if (
				grid.rows[i].cells[j].getAttribute("data-mine") == "false" &&
				grid.rows[i].cells[j].innerHTML == ""
			)
				levelComplete = false;
		}
	}
	if (levelComplete) {
		alert("You Win!");
		revealMines();
	}
}

function clickCell(cell) {
	//Check if the end-user clicked on a mine
	if (cell.getAttribute("data-mine") == "true") {
		revealMines();
		alert("Game Over");
	} else {
		cell.className = "clicked";
		//Count and display the number of adjacent mines
		var mineCount = 0;
		var cellRow = cell.parentNode.rowIndex;
		var cellCol = cell.cellIndex;
		//alert(cellRow + " " + cellCol);
		for (var i = Math.max(cellRow - 1, 0); i <= Math.min(cellRow + 1, 9); i++) {
			for (
				var j = Math.max(cellCol - 1, 0);
				j <= Math.min(cellCol + 1, 9);
				j++
			) {
				if (grid.rows[i].cells[j].getAttribute("data-mine") == "true")
					mineCount++;
			}
		}
		cell.innerHTML = mineCount;
		if (mineCount == 0) {
			//Reveal all adjacent cells as they do not have a mine
			for (
				var i = Math.max(cellRow - 1, 0);
				i <= Math.min(cellRow + 1, 9);
				i++
			) {
				for (
					var j = Math.max(cellCol - 1, 0);
					j <= Math.min(cellCol + 1, 9);
					j++
				) {
					//Recursive Call
					if (grid.rows[i].cells[j].innerHTML == "")
						clickCell(grid.rows[i].cells[j]);
				}
			}
		}
		checkLevelCompletion();
	}
}
