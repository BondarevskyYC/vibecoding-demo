const WINNING_COMBOS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
  [0, 4, 8], [2, 4, 6],             // diagonals
];

let board = Array(9).fill(null);
let currentPlayer = 'X';
let gameOver = false;
let scores = { X: 0, O: 0, draws: 0 };

const cells = document.querySelectorAll('.cell');
const statusEl = document.getElementById('status');
const winsX = document.getElementById('wins-x');
const winsO = document.getElementById('wins-o');
const drawsEl = document.getElementById('draws');
const scoreX = document.getElementById('score-x');
const scoreO = document.getElementById('score-o');
const btnReset = document.getElementById('btn-reset');

function renderBoard() {
  cells.forEach((cell, i) => {
    const val = board[i];
    cell.textContent = val ?? '';
    cell.className = 'cell' + (val ? ` ${val.toLowerCase()}` : '');
    cell.disabled = !!val || gameOver;
  });
}

function setStatus(msg, cls = '') {
  statusEl.textContent = msg;
  statusEl.className = 'status' + (cls ? ` ${cls}` : '');
}

function highlightWinning(combo) {
  combo.forEach(i => cells[i].classList.add('winning'));
}

function updateScoreboard() {
  winsX.textContent = scores.X;
  winsO.textContent = scores.O;
  drawsEl.textContent = scores.draws;
}

function setActiveScore(player) {
  scoreX.classList.toggle('active-x', player === 'X');
  scoreO.classList.toggle('active-o', player === 'O');
}

function checkWinner() {
  for (const combo of WINNING_COMBOS) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], combo };
    }
  }
  if (board.every(cell => cell !== null)) return { winner: null, draw: true };
  return null;
}

function handleClick(e) {
  const index = Number(e.currentTarget.dataset.index);
  if (board[index] || gameOver) return;

  board[index] = currentPlayer;
  renderBoard();

  const result = checkWinner();

  if (result) {
    gameOver = true;
    scoreX.classList.remove('active-x');
    scoreO.classList.remove('active-o');

    if (result.winner) {
      scores[result.winner]++;
      updateScoreboard();
      highlightWinning(result.combo);
      setStatus(`Player ${result.winner} wins!`, 'win');
    } else {
      scores.draws++;
      updateScoreboard();
      setStatus("It's a draw!", 'draw');
    }
    cells.forEach(c => c.disabled = true);
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    setActiveScore(currentPlayer);
    setStatus(`Player ${currentPlayer}'s turn`);
  }
}

function resetGame() {
  board = Array(9).fill(null);
  currentPlayer = 'X';
  gameOver = false;
  setActiveScore('X');
  setStatus("Player X's turn");
  renderBoard();
}

cells.forEach(cell => cell.addEventListener('click', handleClick));
btnReset.addEventListener('click', resetGame);

// Init
setActiveScore('X');
renderBoard();
