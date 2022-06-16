//minesweeper game by 101computing.net - www.101computing.et/minesweeper-in-javascript/
var grid = document.getElementById("grid");
var timer = document.getElementById("timer");
let counter;
var testMode = true; //Turn this variable to true to see where the mines are
let params = {
    Nrows: 20,
    Ncolumns: 10,
    Nmines: 30,
	gameStarted: false,
	time: 0,
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
	var minesCoord = [];
	//Add mines randomly whithout repeating
	for (var i = 0; i < params.Nmines; i++) { 
		do{
		var row = Math.floor(Math.random() * params.Nrows);
		var col = Math.floor(Math.random() * params.Ncolumns);
		var cell = grid.rows[row].cells[col];
		cell.setAttribute("data-mine", "true");
		if (testMode) cell.innerHTML = "X";
		} while(minesCoord.includes(row + "-" + col))
		minesCoord.push(row + "-" + col);
	}
}

function revealMines() {
	//Highlight all mines in red
	for (var i = 0; i < params.Nrows; i++) {
		for (var j = 0; j < params.Ncolumns; j++) {
			var cell = grid.rows[i].cells[j];
			if (cell.getAttribute("data-mine") == "true") cell.className = "mine";
		}
	}
}

function checkLevelCompletion() {
	var levelComplete = true;
	for (var i = 0; i < params.Nrows; i++) {
		for (var j = 0; j < params.Ncolumns; j++) {
			if (
				grid.rows[i].cells[j].getAttribute("data-mine") == "false" &&
				grid.rows[i].cells[j].innerHTML == ""
			)
				levelComplete = false;
		}
	}
	if (levelComplete) {
		alert("You Win!");
		clearInterval(counter);
		revealMines();
	}
}

function clickCell(cell) {
	//start the clock if it's the first click
	if(!params.gameStarted) initTimeCount();
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
		// alert(cellRow + " " + cellCol);
		for (var i = Math.max(cellRow - 1, 0); i <= Math.min(cellRow + 1, params.Nrows -1); i++) {
			for (
				var j = Math.max(cellCol - 1, 0);
				j <= Math.min(cellCol + 1, params.Ncolumns -1);
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
				i <= Math.min(cellRow + 1, params.Nrows - 1);
				i++
			) {
				for (
					var j = Math.max(cellCol - 1, 0);
					j <= Math.min(cellCol + 1, params.Ncolumns -1);
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

function initTimeCount() {
	params.gameStarted = true;
	counter = setInterval(()=>{
		params.time++;
	var t = Number(params.time);
    var h = Math.floor(t / 3600);
    var s = Math.floor(t % 3600 % 60);
    var m = Math.floor(t % 3600 / 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";

		timer.innerHTML=hDisplay + mDisplay + sDisplay; 
	},1000);
}
