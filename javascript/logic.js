export const TILE_STATUSES = {
  HIDDEN: 'hidden',
  MINE: 'mine',
  NUMBER: 'number',
  MARKED: 'marked',
};

export function revealTile(board, tile) {
  if (tile.status !== TILE_STATUSES.HIDDEN) {
    return;
  }
  if (tile.mine) {
    tile.status = TILE_STATUSES.MINE;
    return;
  }
  tile.status = TILE_STATUSES.NUMBER;

  const adjacentTiles = nearbyTiles(board, tile);
  const mines = adjacentTiles.filter((t) => t.mine);
  if (mines.length === 0) {
    adjacentTiles.forEach((tile) => revealTile(board, tile));
  } else {
    tile.element.textContent = mines.length;
  }
}

export function markTile(tile, minesLeftText) {
  if (
    tile.status !== TILE_STATUSES.HIDDEN &&
    tile.status !== TILE_STATUSES.MARKED
  ) {
    return;
  }

  if (tile.status === TILE_STATUSES.MARKED) {
    tile.status = TILE_STATUSES.HIDDEN;
    minesLeftText.textContent = parseInt(minesLeftText.textContent) + 1;
  } else {
    tile.status = TILE_STATUSES.MARKED;
    minesLeftText.textContent = parseInt(minesLeftText.textContent) - 1;
  }
}

export function createBoard(boardSize, numberOfMines) {
  const board = [];
  const minePositions = getMinePositions(boardSize, numberOfMines);
  console.log(minePositions);

  for (let xAxis = 0; xAxis < boardSize; xAxis++) {
    const row = [];
    for (let yAxis = 0; yAxis < boardSize; yAxis++) {
      const element = document.createElement('div');
      element.dataset.status = TILE_STATUSES.HIDDEN;

      const tile = {
        element,
        xAxis,
        yAxis,
        mine: minePositions.some((p) =>
          positionMatch(p, { x: xAxis, y: yAxis })
        ),
        get status() {
          return this.element.dataset.status;
        },
        set status(value) {
          this.element.dataset.status = value;
        },
      };
      row.push(tile);
    }
    board.push(row);
  }

  return board;
}

function getMinePositions(boardSize, numberOfMines) {
  const positions = [];

  while (positions.length < numberOfMines) {
    const position = {
      x: randomNumber(boardSize),
      y: randomNumber(boardSize),
    };
    //(p) => positionMatch(p, position)
    // positionMatch.bind(null, position)
    if (!positions.some((p) => positionMatch(p, position))) {
      positions.push(position);
    }
  }

  return positions;
}

function positionMatch(a, b) {
  return a.x === b.x && a.y === b.y;
}

function randomNumber(size) {
  return Math.floor(Math.random() * size);
}

function nearbyTiles(board, { xAxis, yAxis }) {
  const tiles = [];

  for (let xOffset = -1; xOffset <= 1; xOffset++) {
    for (let yOffset = -1; yOffset <= 1; yOffset++) {
      const tile = board[xAxis + xOffset]?.[yAxis + yOffset];
      if (tile) {
        tiles.push(tile);
      }
    }
  }

  return tiles;
}

export function checkWin(board) {
  return board.every((row) => {
    return row.every((tile) => {
      return (
        tile.status === TILE_STATUSES.NUMBER ||
        (tile.mine &&
          (tile.status === TILE_STATUSES.HIDDEN ||
            tile.status === TILE_STATUSES.MARKED))
      );
    });
  });
}

export function checkLose(board) {
  return board.some((row) => {
    return row.some((tile) => {
      return tile.status === TILE_STATUSES.MINE;
    });
  });
}
