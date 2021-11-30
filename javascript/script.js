import {
  TILE_STATUSES,
  createBoard,
  markTile,
  revealTile,
  checkWin,
  checkLose,
} from './logic.js';

const boardSizeElement = document.getElementsByClassName('boardSizeInput')[0];
const numberOfMinesElement = document.getElementsByClassName('minesInput')[0];

const BOARD_SIZE =
  localStorage['boardSize'] != undefined && localStorage['boardSize'] > 0
    ? localStorage['boardSize']
    : 10;
const NUMBER_OF_MINES =
  localStorage['numberOfMines'] != undefined &&
  localStorage['numberOfMines'] > 0
    ? localStorage['numberOfMines']
    : 5;

const board = createBoard(BOARD_SIZE, NUMBER_OF_MINES);
const boardElement = document.querySelector('.board');
const minesLeftText = document.querySelector('[data-mine-count]');
boardElement.style.setProperty('--size', BOARD_SIZE);

const messageText = document.querySelector('.subtitle');

document.getElementById('button').addEventListener('click', buttonClicked);

function buttonClicked() {
  localStorage['numberOfMines'] = numberOfMinesElement.value;
  localStorage['boardSize'] = boardSizeElement.value;
  console.log(numberOfMinesElement.value);
  window.location.reload();
}

board.forEach((row) => {
  row.forEach((tile) => {
    boardElement.append(tile.element);
    tile.element.addEventListener('click', () => {
      revealTile(board, tile);
      checkGameEnd();
    });
    tile.element.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      markTile(tile, minesLeftText);
    });
  });
});

minesLeftText.textContent = NUMBER_OF_MINES;

function checkGameEnd() {
  const win = checkWin(board);
  const lose = checkLose(board);

  if (win || lose) {
    boardElement.addEventListener('click', stopProp, { capture: true });
    boardElement.addEventListener('contextmenu', stopProp, { capture: true });
  }

  if (win) {
    messageText.textContent = 'YOU WON';
  }
  if (lose) {
    messageText.textContent = 'YOU LOST';
    board.forEach((row) => {
      row.forEach((tile) => {
        if (tile.status === TILE_STATUSES.MARKED) markTile(tile);
        if (tile.mine) revealTile(board, tile);
      });
    });
  }
}

function stopProp(e) {
  e.stopImmediatePropagation();
}
