// server.js
const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

let board = [
  [" ", " ", " "],
  [" ", " ", " "],
  [" ", " ", " "],
];

let currentPlayer = "X";
let gameActive = true;

const checkWinner = () => {
  for (let i = 0; i < 3; i++) {
    if (
      board[i].every((cell) => cell === currentPlayer) ||
      [board[0][i], board[1][i], board[2][i]].every(
        (cell) => cell === currentPlayer
      )
    ) {
      return true;
    }
  }
  if (
    [board[0][0], board[1][1], board[2][2]].every(
      (cell) => cell === currentPlayer
    ) ||
    [board[0][2], board[1][1], board[2][0]].every(
      (cell) => cell === currentPlayer
    )
  ) {
    return true;
  }
  return false;
};

const isBoardFull = () => {
  return board.every((row) => row.every((cell) => cell !== " "));
};

app.get("/board", (req, res) => {
  res.json({ board, currentPlayer, gameActive });
});

app.post("/move", (req, res) => {
  const { row, col } = req.body;

  if (!gameActive) {
    return res.status(400).json({ message: "O jogo já terminou." });
  }

  if (row < 0 || row > 2 || col < 0 || col > 2 || board[row][col] !== " ") {
    return res
      .status(400)
      .json({ message: "Movimento inválido. Tente novamente." });
  }

  board[row][col] = currentPlayer;

  if (checkWinner()) {
    gameActive = false;
    return res.json({ message: `Jogador ${currentPlayer} venceu!`, board });
  }

  if (isBoardFull()) {
    gameActive = false;
    return res.json({ message: "Empate!", board });
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  res.json({
    message: "Movimento realizado com sucesso.",
    board,
    currentPlayer,
  });
});

app.post("/reset", (req, res) => {
  board = [
    [" ", " ", " "],
    [" ", " ", " "],
    [" ", " ", " "],
  ];
  currentPlayer = "X";
  gameActive = true;
  res.json({ message: "Jogo reiniciado.", board, currentPlayer });
});

app.listen(port, () => {
  console.log(`Servidor do jogo da Velha rodando em http://localhost:${port}`);
});
