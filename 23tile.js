class TilePuzzle {
    constructor() {
        this.board = [];
        this.emptyPosition = { row: 3, col: 5 }; // Bottom-right corner
        this.moves = 0;
        this.gameBoard = document.getElementById('game-board');
        this.movesDisplay = document.getElementById('moves');
        this.winMessage = document.getElementById('win-message');
        this.finalMovesDisplay = document.getElementById('final-moves');
        
        this.initBoard();
        this.renderBoard();
        this.attachEventListeners();
    }
    
    initBoard() {
        // Create a 4x6 board (24 positions, 23 tiles + 1 empty)
        let number = 1;
        for (let row = 0; row < 4; row++) {
            this.board[row] = [];
            for (let col = 0; col < 6; col++) {
                if (row === 3 && col === 5) {
                    this.board[row][col] = null; // Empty space
                } else {
                    this.board[row][col] = number++;
                }
            }
        }
    }
    
    renderBoard() {
        this.gameBoard.innerHTML = '';
        
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 6; col++) {
                const tile = document.createElement('button');
                tile.className = 'tile';
                
                if (this.board[row][col] === null) {
                    tile.classList.add('empty');
                } else {
                    tile.textContent = this.board[row][col];
                    tile.addEventListener('click', () => this.moveTile(row, col));
                }
                
                this.gameBoard.appendChild(tile);
            }
        }
    }
    
    canMove(row, col) {
        const rowDiff = Math.abs(row - this.emptyPosition.row);
        const colDiff = Math.abs(col - this.emptyPosition.col);
        
        // Can move if adjacent to empty space (horizontally or vertically)
        return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
    }
    
    moveTile(row, col) {
        if (!this.canMove(row, col)) {
            return;
        }
        
        // Swap tile with empty space
        this.board[this.emptyPosition.row][this.emptyPosition.col] = this.board[row][col];
        this.board[row][col] = null;
        
        this.emptyPosition = { row, col };
        this.moves++;
        this.movesDisplay.textContent = this.moves;
        
        this.renderBoard();
        
        if (this.checkWin()) {
            this.showWinMessage();
        }
    }
    
    checkWin() {
        let expectedNumber = 1;
        
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 6; col++) {
                if (row === 3 && col === 5) {
                    // Empty space should be at the end
                    return this.board[row][col] === null;
                }
                
                if (this.board[row][col] !== expectedNumber) {
                    return false;
                }
                
                expectedNumber++;
            }
        }
        
        return true;
    }
    
    shuffle() {
        // Reset win message
        this.winMessage.classList.add('hidden');
        
        // Perform random moves to shuffle the board
        const shuffleMoves = 200;
        
        for (let i = 0; i < shuffleMoves; i++) {
            const possibleMoves = this.getPossibleMoves();
            const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
            
            // Move without incrementing the move counter
            this.board[this.emptyPosition.row][this.emptyPosition.col] = this.board[randomMove.row][randomMove.col];
            this.board[randomMove.row][randomMove.col] = null;
            this.emptyPosition = randomMove;
        }
        
        // Reset moves counter
        this.moves = 0;
        this.movesDisplay.textContent = this.moves;
        
        this.renderBoard();
    }
    
    getPossibleMoves() {
        const moves = [];
        const { row, col } = this.emptyPosition;
        
        // Check all four directions
        if (row > 0) moves.push({ row: row - 1, col });
        if (row < 3) moves.push({ row: row + 1, col });
        if (col > 0) moves.push({ row, col: col - 1 });
        if (col < 5) moves.push({ row, col: col + 1 });
        
        return moves;
    }
    
    reset() {
        this.winMessage.classList.add('hidden');
        this.moves = 0;
        this.movesDisplay.textContent = this.moves;
        this.emptyPosition = { row: 3, col: 5 };
        this.initBoard();
        this.renderBoard();
    }
    
    showWinMessage() {
        this.finalMovesDisplay.textContent = this.moves;
        this.winMessage.classList.remove('hidden');
    }
    
    attachEventListeners() {
        document.getElementById('shuffle-btn').addEventListener('click', () => this.shuffle());
        document.getElementById('reset-btn').addEventListener('click', () => this.reset());
        document.getElementById('play-again-btn').addEventListener('click', () => this.shuffle());
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new TilePuzzle();
});
