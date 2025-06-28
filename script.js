// Create floating particles
function createParticles() {
  const particlesContainer = document.getElementById("particles");
  const particleCount = 50;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.style.left = Math.random() * 100 + "%";
    particle.style.top = Math.random() * 100 + "%";
    particle.style.animationDuration = Math.random() * 3 + 3 + "s";
    particle.style.animationDelay = Math.random() * 2 + "s";
    particlesContainer.appendChild(particle);
  }
}

class TicTacToe {
  constructor() {
    this.board = Array(9).fill("");
    this.currentPlayer = "X";
    this.gameActive = true;
    this.gameMode = "twoPlayer";
    this.scores = { X: 0, O: 0, draw: 0 };

    this.winningConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // columns
      [0, 4, 8],
      [2, 4, 6], // diagonals
    ];

    this.initializeGame();
  }

  initializeGame() {
    this.bindEvents();
    this.updateDisplay();
    createParticles();
  }

  bindEvents() {
    document.querySelectorAll(".cell").forEach((cell) => {
      cell.addEventListener("click", (e) => {
        console.log(`Cell clicked: ${e.target.dataset.index}`); // Debug log
        this.handleCellClick(e);
      });
    });

    document
      .getElementById("twoPlayerBtn")
      .addEventListener("click", () => this.setGameMode("twoPlayer"));
    document
      .getElementById("computerBtn")
      .addEventListener("click", () => this.setGameMode("computer"));
    document
      .getElementById("resetBtn")
      .addEventListener("click", () => this.resetGame());
    document
      .getElementById("newGameBtn")
      .addEventListener("click", () => this.newGame());
    document
      .getElementById("modalBtn")
      .addEventListener("click", () => this.closeModal());
  }

  setGameMode(mode) {
    this.gameMode = mode;
    document
      .querySelectorAll(".mode-btn")
      .forEach((btn) => btn.classList.remove("active"));

    if (mode === "twoPlayer") {
      document.getElementById("twoPlayerBtn").classList.add("active");
    } else {
      document.getElementById("computerBtn").classList.add("active");
    }

    this.resetGame();
  }

  handleCellClick(e) {
    const index = parseInt(e.target.dataset.index);
    console.log(
      `Handling click on index: ${index}, Game Active: ${this.gameActive}, Cell Value: ${this.board[index]}`
    ); // Debug log

    if (this.board[index] !== "" || !this.gameActive) {
      console.log("Move rejected: Cell already filled or game not active"); // Debug log
      return;
    }

    this.makeMove(index, this.currentPlayer);

    if (
      this.gameActive &&
      this.gameMode === "computer" &&
      this.currentPlayer === "O"
    ) {
      console.log("Computer is making a move..."); // Debug log
      setTimeout(() => this.computerMove(), 500);
    }
  }

  makeMove(index, player) {
    this.board[index] = player;
    this.updateCell(index, player);

    if (this.checkWinner()) {
      this.endGame(player);
    } else if (this.checkDraw()) {
      this.endGame("draw");
    } else {
      this.currentPlayer = this.currentPlayer === "X" ? "O" : "X";
      this.updateDisplay();
    }
  }

  computerMove() {
    if (!this.gameActive) return;

    let move =
      this.findWinningMove("O") ||
      this.findWinningMove("X") ||
      this.findStrategicMove();

    if (move !== null) {
      console.log(`Computer move: ${move}`); // Debug log
      this.makeMove(move, "O");
    }
  }

  findWinningMove(player) {
    for (let condition of this.winningConditions) {
      const [a, b, c] = condition;
      const values = [this.board[a], this.board[b], this.board[c]];

      if (
        values.filter((val) => val === player).length === 2 &&
        values.includes("")
      ) {
        return condition[values.indexOf("")];
      }
    }
    return null;
  }

  findStrategicMove() {
    const priorities = [4, 0, 2, 6, 8, 1, 3, 5, 7];

    for (let index of priorities) {
      if (this.board[index] === "") {
        return index;
      }
    }
    return null;
  }

  checkWinner() {
    for (let condition of this.winningConditions) {
      const [a, b, c] = condition;

      if (
        this.board[a] &&
        this.board[a] === this.board[b] &&
        this.board[a] === this.board[c]
      ) {
        this.highlightWinningCells([a, b, c]);
        return true;
      }
    }
    return false;
  }

  checkDraw() {
    return this.board.every((cell) => cell !== "");
  }

  highlightWinningCells(indices) {
    indices.forEach((index) => {
      document
        .querySelector(`[data-index="${index}"]`)
        .classList.add("winning-cell");
    });
  }

  endGame(result) {
    this.gameActive = false;

    if (result === "draw") {
      this.scores.draw++;
      this.showModal("🤝 It's a Draw!", "Nobody wins this round!");
    } else {
      this.scores[result]++;
      const winnerName =
        this.gameMode === "computer" && result === "O"
          ? "Computer"
          : `Player ${result}`;
      this.showModal("🎉 Victory!", `${winnerName} wins!`);
    }

    this.updateScores();
  }

  showModal(title, message) {
    document.getElementById("modalTitle").textContent = title;
    document.getElementById("modalMessage").textContent = message;
    document.getElementById("gameModal").style.display = "block";
  }

  closeModal() {
    document.getElementById("gameModal").style.display = "none";
    this.resetGame();
  }

  updateCell(index, player) {
    const cell = document.querySelector(`[data-index="${index}"]`);
    cell.textContent = player;
    cell.classList.add(player.toLowerCase());
    cell.disabled = true;
  }

  updateDisplay() {
    if (this.gameActive) {
      const playerName =
        this.gameMode === "computer" && this.currentPlayer === "O"
          ? "Computer"
          : `Player ${this.currentPlayer}`;
      document.getElementById(
        "currentPlayer"
      ).textContent = `${playerName}'s Turn`;
    }
  }

  updateScores() {
    document.getElementById("scoreX").textContent = this.scores.X;
    document.getElementById("scoreO").textContent = this.scores.O;
    document.getElementById("scoreDraw").textContent = this.scores.draw;
  }

  resetGame() {
    this.board = Array(9).fill("");
    this.currentPlayer = "X";
    this.gameActive = true;

    document.querySelectorAll(".cell").forEach((cell) => {
      cell.textContent = "";
      cell.disabled = false;
      cell.classList.remove("x", "o", "winning-cell");
    });

    this.updateDisplay();
  }

  newGame() {
    this.resetGame();
    this.scores = { X: 0, O: 0, draw: 0 };
    this.updateScores();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("Game initializing..."); // Debug log
  new TicTacToe();
});
