const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const resetButton = document.getElementById('reset-button');
const modeSelection = document.getElementById('mode-selection');
const gameBoard = document.getElementById('game-board');
let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];
let isGameActive = true;
let gameMode = ''; // 'PvP' or 'PvCom'
const player = 'X';
const computer = 'O';

// Winning combinations
const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Handle cell clicks
cells.forEach(cell => {
    cell.addEventListener('click', handleClick);
});

// Game mode selection
document.getElementById('pvp-mode').addEventListener('click', () => {
    startGame('PvP');
});

document.getElementById('pvcom-mode').addEventListener('click', () => {
    startGame('PvCom');
});

// Start the game in the selected mode
function startGame(mode) {
    gameMode = mode;
    modeSelection.style.display = 'none';
    gameBoard.style.display = 'grid';
    statusText.style.display = 'block';
    resetButton.style.display = 'block';
    statusText.textContent = `Player X's Turn`;
}

// Handle player or computer clicks depending on mode
function handleClick(e) {
    const index = e.target.getAttribute('data-index');

    // Check if the cell is already filled or the game is over
    if (board[index] !== '' || !isGameActive) return;

    // Player's move (works for both PvP and PvCom)
    board[index] = currentPlayer;
    e.target.textContent = currentPlayer;
    e.target.classList.add('clicked', currentPlayer); // Add animation and neon color

    // Check if the current player wins
    if (checkWinner()) {
        statusText.textContent = `Player ${currentPlayer} Wins!`;
        isGameActive = false;
        return;
    }

    // Check for a draw
    if (!board.includes('')) {
        statusText.textContent = `It's a Draw!`;
        isGameActive = false;
        return;
    }

    // Switch to the other player or computer
    if (gameMode === 'PvP') {
        // PvP mode: Switch to the other player
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusText.textContent = `Player ${currentPlayer}'s Turn`;
    } else if (gameMode === 'PvCom') {
        // PvCom mode: Switch to computer if it's the player's turn
        if (currentPlayer === player) {
            currentPlayer = computer;
            statusText.textContent = `Computer's Turn`;

            // Computer's move after a short delay
            setTimeout(computerMove, 800);
        }
    }
}

// Computer's move in PvCom mode
function computerMove() {
    let availableCells = board.map((cell, index) => (cell === '' ? index : null)).filter(index => index !== null);

    // Randomly choose one of the available cells for the computer
    let randomIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
    board[randomIndex] = currentPlayer;

    // Update the UI
    const cell = document.querySelector(`.cell[data-index='${randomIndex}']`);
    cell.textContent = currentPlayer;
    cell.classList.add('clicked', currentPlayer); // Add animation and neon color

    // Check if the computer wins
    if (checkWinner()) {
        statusText.textContent = `Computer Wins!`;
        isGameActive = false;
        return;
    }

    // Check for a draw
    if (!board.includes('')) {
        statusText.textContent = `It's a Draw!`;
        isGameActive = false;
        return;
    }

    // Switch back to the player
    currentPlayer = player;
    statusText.textContent = `Player ${currentPlayer}'s Turn`;
}

// Check if the current player has won
function checkWinner() {
    return winningCombinations.some(combination => {
        return combination.every(index => {
            return board[index] === currentPlayer;
        });
    });
}

// Reset the game
resetButton.addEventListener('click', resetGame);

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    isGameActive = true;
    currentPlayer = player; // Player X always starts
    statusText.textContent = `Player ${currentPlayer}'s Turn`;
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('clicked', 'X', 'O'); // Reset classes
    });
}
