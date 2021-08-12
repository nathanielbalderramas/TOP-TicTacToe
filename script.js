const gameboard = (() => {
    let board = [];
    const getBoard = () => board;
    const restartBoard = () => {
        board = [["", "", ""],
                 ["", "", ""],
                 ["", "", ""]];
    }

    const setOwnerId = (posY, posX, owner) => {
        if ((0 <= posY && posY <= 2) && (0 <= posX && posX <= 2)) {
            if (board[posY][posX] === "") {
                board[posY][posX] = owner.getId();
                let cell = document.querySelector(`[data-y="${posY}"][data-x="${posX}"]`);
                cell.style.color = owner.getColor();
                cell.textContent = owner.getSymbol();
                return true;
            } else {return false}
        }
    }

    const getOwnerId = (posY, posX) => {
        if ((0 <= posY && posY <= 2) && (0 <= posX && posX <= 2)) {
            return board[posY][posX]
        } else {
            return false;
        }
    }

    const checkFullColumn = (y, x) => {
        const owner = getOwnerId(y, x);
        return getOwnerId(0, x) === owner && getOwnerId(1, x) === owner && getOwnerId(2, x) === owner;
    }

    const checkFullRow = (y, x) => {
        const owner = getOwnerId(y, x);
        return getOwnerId(y, 0) === owner && getOwnerId(y, 1) === owner && getOwnerId(y, 2) === owner;
    }

    const checkFullDiags = (y, x) => {
        const owner = getOwnerId(y, x);
        if (getOwnerId(0, 0) === owner) {
            return getOwnerId(1, 1) === owner && getOwnerId(2, 2) === owner;
        } else if (getOwnerId(0, 2) === owner) {
            return getOwnerId(1, 1) === owner && getOwnerId(2, 0) === owner;
        }
    }

    const checkWin = (lastY, lastX) => {
        return checkFullColumn(lastY, lastX) || checkFullRow(lastY, lastX) || checkFullDiags(lastY, lastX);
    }

    return {setOwnerId, getOwnerId, checkWin, restartBoard, getBoard}
})()

const Player = (id, name, symbol, color) => {
    const getId = () => id;
    const getName = () => name;
    const setName = (newName) => {name = newName};
    const getSymbol = () => symbol;
    const getColor = () => color;
    const setColor = (newColor) => {color = newColor};

    let score = 0
    const getScore = () => score;
    const increaseScore = () => {score += 1};
    
    return {getId, 
            getName, setName, 
            getSymbol, 
            getColor, setColor,
            getScore, increaseScore}
    }


const game = (() => {
    const player1 = Player("p1", "player 1", "X", "#f00");
    const player2 = Player("p2", "player 2", "O", "#0f0");
    
    let lastWinner = "no one"
    const getLastWinner = () => lastWinner;
    let turn = 0;

    const checkEndGame = (cellY, cellX) => {
        if (gameboard.checkWin(cellY, cellX)) {
            return gameboard.getOwnerId(cellY, cellX)
        } else  if (turn >= 9) {
            return "tie"
        } else {
            return false
        }
    }

    const playRound = (event) => {
        // if (!event.target.classList.contains("cell")) {return}
        cellY = event.target.dataset.y;
        cellX = event.target.dataset.x;
        
        let validMove = false;
        if (turn % 2 === 0) {
            validMove = gameboard.setOwnerId(cellY, cellX, player1);
        } else {
            validMove = gameboard.setOwnerId(cellY, cellX, player2);
        }
        if (validMove) {turn += 1;}
        
        let winner = checkEndGame(cellY, cellX);
        if (winner) {
            if (winner === "p1") {
                player1.increaseScore();
                lastWinner = player1.getName();
            } else if (winner === "p2") {
                player2.increaseScore();
                lastWinner = player2.getName();
            } else {lastWinner = "no one, it was a tie!"}
            endGame();
        }
    }

    const endGame = () => {
        cells.forEach((cell) => {
            removeEventListener("click", playRound);
        })
        document.querySelector(".p1-score").textContent = player1.getScore();
        document.querySelector(".p2-score").textContent = player2.getScore();
        
        let winnerSign = document.createElement("div");
        winnerSign.classList.add("winnerSign");
        winnerSign.textContent = `The winner is: ${getLastWinner()}`;
        let closeButton = document.createElement("div");
        closeButton.textContent = "OK"
        closeButton.classList.add("closeButton");
        closeButton.addEventListener("click", startGame);
        winnerSign.appendChild(closeButton);
        document.querySelector("body").appendChild(winnerSign);

    }

    const startGame = () => {
        let winnerSign = document.querySelector(".winnerSign");
        if (winnerSign) {
            let closeButton = document.querySelector(".closeButton");
            closeButton.removeEventListener("click", startGame);
            closeButton.remove();
            winnerSign.remove();
        }
        winner = false;
        turn = 0;
        gameboard.restartBoard();
        cells.forEach((cell) => {
            cell.textContent = "";
            addEventListener("click", playRound);
        })}

    const cells = document.querySelectorAll(".cell");




    return {startGame, player1, player2}
})();


game.startGame();
const configMenu = document.querySelector(".config-menu");
configMenu.parentNode.removeChild(configMenu);
document.querySelector("body").appendChild(configMenu);


// const ShowConfigMenu = () => {
//     let menu = document.createElement("div");
//     menu.classList.add("config-menu");
//     document.querySelector("body").appendChild(menu);
// }

// Game Config Interface...
const configButton = document.querySelector(".config-button");
const p1Name = document.querySelector(".p1-name");
const p2Name = document.querySelector(".p2-name");
p1Name.textContent = game.player1.getName()+":";
p2Name.textContent = game.player2.getName()+":";
configButton.addEventListener("click", ShowConfigMenu());
