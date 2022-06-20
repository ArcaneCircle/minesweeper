//minesweeper game by 101computing.net - www.101computing.et/minesweeper-in-javascript/
var grid = document.getElementById("grid");
var timer = document.getElementById("timer");
var scores = document.getElementById("scores");
var home = document.getElementById("home");
var easyBtn = document.getElementById("easy");
var mediumBtn = document.getElementById("medium");
var hardBtn = document.getElementById("hard");

let counter;
var testMode = false; //Turn this variable to true to see where the mines are
let params = {
	Nrows: 0,
	Ncolumns: 0,
	Nmines: 0,
	gameStarted: false,
	time: 0,
	level: "easy",
};
const levels = {
easy: {
	Nrows: 9,
	Ncolumns: 9,
	Nmines: 10
},
medium: {
	Nrows: 15,
	Ncolumns: 9,
	Nmines: 25
},
hard: {
	Nrows: 17,
	Ncolumns: 10,
	Nmines: 30
}

};

window.highscores.init("Minesweeper");

startGame();

function startGame() {
	easyBtn.addEventListener("click", () => {
		params.Nrows = levels.easy.Nrows;
		params.Ncolumns = levels.easy.Ncolumns;
		params.Nmines = levels.easy.Nmines;
		generateGrid();
	});

	mediumBtn.addEventListener("click", () => {
		params.Nrows = levels.medium.Nrows;
		params.Ncolumns = levels.medium.Ncolumns;
		params.Nmines = levels.medium.Nmines;
		generateGrid();
	});

	hardBtn.addEventListener("click", () => {
		params.Nrows = levels.hard.Nrows;
		params.Ncolumns = levels.hard.Ncolumns;
		params.Nmines = levels.hard.Nmines;
		generateGrid();
	});

}

function generateGrid() {
	//clear home screen
	home.remove();
	//generate grid
	grid.innerHTML = "";
	for (var i = 0; i < params.Nrows; i++) {
		row = grid.insertRow(i);
		for (var j = 0; j < params.Ncolumns; j++) {
			cell = row.insertCell(j);
			//click in the cell
			cell.onclick = function () {
				clickCell(this);
			};
			//mark cell with flag
			cell.oncontextmenu = function (event) {
				flagCell(this);
				event.preventDefault();
			};
			var mine = document.createAttribute("data-mine");
			mine.value = "false";
			var flag = document.createAttribute("flag");
			flag.value = "false";
			cell.setAttributeNode(flag);
			cell.setAttributeNode(mine);
		}
	}
	addMines();
}

function addMines() {
	var minesCoord = [];
	//Add mines randomly whithout repeating
	for (var i = 0; i < params.Nmines; i++) {
		do {
			var row = Math.floor(Math.random() * params.Nrows);
			var col = Math.floor(Math.random() * params.Ncolumns);
			var cell = grid.rows[row].cells[col];
			cell.setAttribute("data-mine", "true");
			if (testMode) cell.innerHTML = "X";
		} while (minesCoord.includes(row + "-" + col));
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
				grid.rows[i].cells[j].className != "clicked"
			)
				levelComplete = false;
		}
	}
	if (levelComplete) {
		clearInterval(counter);
		window.highscores.setScore(params.time);
		revealMines();
		scores.appendChild(window.highscores.getScoreboard());
		// scores.style.display = "block";
		scores.style.visibility = "visible";
		scores.style.opacity = 1;
	}
}

function flagCell(cell) {
	if (cell.getAttribute("flag") == "false") {
		cell.innerHTML = "🚩";
		cell.setAttribute("flag", "true");
	} else {
		cell.innerHTML = "";
		cell.setAttribute("flag", "false");
	}
}

function clickCell(cell) {
	//start the clock if it's the first click
	if (!params.gameStarted) initTimeCount();
	if (cell.getAttribute("flag") != "true") {
		//Check if the end-user clicked on a mine
		if (cell.getAttribute("data-mine") == "true") {
			revealMines();
			clearInterval(counter);
			scores.innerHTML = "<h1>Game Over</h1>";
			scores.style.visibility = "visible";
			scores.style.opacity = 1;
		} else {
			cell.className = "clicked";
			//Count and display the number of adjacent mines
			var mineCount = 0;
			var cellRow = cell.parentNode.rowIndex;
			var cellCol = cell.cellIndex;
			// alert(cellRow + " " + cellCol);
			for (
				var i = Math.max(cellRow - 1, 0);
				i <= Math.min(cellRow + 1, params.Nrows - 1);
				i++
			) {
				for (
					var j = Math.max(cellCol - 1, 0);
					j <= Math.min(cellCol + 1, params.Ncolumns - 1);
					j++
				) {
					if (grid.rows[i].cells[j].getAttribute("data-mine") == "true")
						mineCount++;
				}
			}
			mineCount === 0 ? (cell.innerHTML = "") : (cell.innerHTML = mineCount);
			if (mineCount == 0) {
				//Reveal all adjacent cells as they do not have a mine
				for (
					var i = Math.max(cellRow - 1, 0);
					i <= Math.min(cellRow + 1, params.Nrows - 1);
					i++
				) {
					for (
						var j = Math.max(cellCol - 1, 0);
						j <= Math.min(cellCol + 1, params.Ncolumns - 1);
						j++
					) {
						//Recursive Call
						if (grid.rows[i].cells[j].className != "clicked")
							clickCell(grid.rows[i].cells[j]);
					}
				}
			}
			checkLevelCompletion();
		}
	}
}

function initTimeCount() {
	params.gameStarted = true;
	counter = setInterval(() => {
		params.time++;
		var t = Number(params.time);
		var h = Math.floor(t / 3600);
		var s = Math.floor((t % 3600) % 60);
		var m = Math.floor((t % 3600) / 60);

		var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
		var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
		var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";

		timer.innerHTML = hDisplay + mDisplay + sDisplay;
	}, 1000);
}
