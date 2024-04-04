let board,
  score = 0,
  rows = 4,
  columns = 4;
window.onload = () => {
  setgame();
};
function setgame() {
  document.getElementById("board").innerHTML = "";
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      let tile = document.createElement("div");
      tile.id = i.toString() + "-" + j.toString();
      let num = board[i][j];
      updatetile(num, tile);
      document.getElementById("board").append(tile);
    }
  }
  setTwo();
  setTwo();
}
function notempty() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      if (board[i][j] == "") {
        return false;
      }
    }
  }
  return true;
}
function setTwo() {
  let notfound = true;
  if (notempty()) {
    notfound = false;
  }
  while (notfound) {
    let i = Math.floor(Math.random() * rows);
    let j = Math.floor(Math.random() * columns);
    if (board[i][j] == 0) {
      let tile = document.getElementById(`${i.toString()}-${j.toString()}`);
      let num = 2;
      board[i][j] = 2;
      updatetile(num, tile);
      notfound = false;
    }
  }
}
function updatetile(num, tile) {
  tile.innerText = "";
  tile.setAttribute("class", "tile");
  if (num > 0) {
    tile.innerText = num;
    if (num <= 4096) {
      tile.classList.add("x" + num.toString());
    } else {
      tile.classList.add("x8192");
    }
  }
}
function filterzero(row) {
  return row.filter((num) => num > 0);
}
function slide(row) {
  row = filterzero(row);
  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] == row[i + 1]) {
      row[i] *= 2;
      row[i + 1] = 0;
      score += row[i];
      document.getElementById("score").innerText = score;
    }
  }
  row = filterzero(row);
  while (row.length < columns) {
    row.push(0);
  }

  return row;
}
function slideleft() {
  for (let i = 0; i < rows; i++) {
    let row = board[i];
    row = slide(row);
    board[i] = row;
    for (let j = 0; j < columns; j++) {
      let tile = document.getElementById(i.toString() + "-" + j.toString());
      let num = board[i][j];
      updatetile(num, tile);
    }
  }
}
function slideright() {
  for (let i = 0; i < rows; i++) {
    let row = board[i];
    row.reverse();
    row = slide(row);
    row.reverse();
    board[i] = row;
    for (let j = 0; j < columns; j++) {
      let tile = document.getElementById(i.toString() + "-" + j.toString());
      let num = board[i][j];
      updatetile(num, tile);
    }
  }
}
function slideup() {
  for (let j = 0; j < columns; j++) {
    let row = [board[0][j], board[1][j], board[2][j], board[3][j]];
    row = slide(row);
    for (let i = 0; i < rows; i++) {
      board[i][j] = row[i];
      let num = board[i][j];
      let tile = document.getElementById(i.toString() + "-" + j.toString());
      updatetile(num, tile);
    }
  }
}

function slidedown() {
  for (let j = 0; j < columns; j++) {
    let row = [board[0][j], board[1][j], board[2][j], board[3][j]];
    row.reverse();
    row = slide(row);
    row.reverse();
    for (let i = 0; i < rows; i++) {
      board[i][j] = row[i];
      let num = board[i][j];
      let tile = document.getElementById(i.toString() + "-" + j.toString());
      updatetile(num, tile);
    }
  }
}
function checkgameover() {
  if (isGameOver()) {
    alert("Game Over! Your score is: " + score);
    resetGame();
  }
}

function isGameOver() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      if (board[i][j] == 0) {
        return false;
      }
    }
  }
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      if (j < columns - 1 && board[i][j] == board[i][j + 1]) {
        return false;
      }
      if (i < rows - 1 && board[i][j] == board[i + 1][j]) {
        return false;
      }
    }
  }

  return true;
}

function resetGame() {
  score = 0;
  document.getElementById("score").innerText = score;
  setgame();
}

document.addEventListener("keyup", (e) => {
  if (e.code == "ArrowLeft") {
    slideleft();
    setTwo();
    checkgameover();
  }
  if (e.code == "ArrowRight") {
    slideright();
    setTwo();
    checkgameover();
  }
  if (e.code == "ArrowUp") {
    slideup();
    setTwo();
    checkgameover();
  }
  if (e.code == "ArrowDown") {
    slidedown();
    setTwo();
    checkgameover();
  }
});
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

document.addEventListener(
  "touchstart",
  function (event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
  },
  false
);

document.addEventListener(
  "touchmove",
  function (event) {
    event.preventDefault();
  },
  false
);

document.addEventListener(
  "touchend",
  function (event) {
    touchEndX = event.changedTouches[0].clientX;
    touchEndY = event.changedTouches[0].clientY;
    handleSwipe();
  },
  false
);

//for touch screen devices
function handleSwipe() {
  let deltaX = touchEndX - touchStartX;
  let deltaY = touchEndY - touchStartY;
  let swipeThreshold = 50;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    if (deltaX > swipeThreshold) {
      slideright();
          setTwo();
          checkgameover();
    } else if (deltaX < -swipeThreshold) {
      slideleft();
          setTwo();
          checkgameover();
    }
  } else {
    if (deltaY > swipeThreshold) {
      slidedown();
          setTwo();
          checkgameover();
    } else if (deltaY < -swipeThreshold) {
      slideup();
          setTwo();
          checkgameover();
    }
  }
}

