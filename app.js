const gameBoard = (()=> {
    let gameStats = [
        [null,null,null],
        [null,null,null],
        [null,null,null]
    ]
    let history = []

    // cache dom
    const board = document.querySelector('.tictactoe-container')
    const announcementBoard = document.querySelector('.info')
    
    // bind events
    board.addEventListener('click', boardClickHandler)

    render()

    // methods
    function render() {
        board.innerHTML = ''
        let tempBoard = document.createElement('div')
        for(let row = 0; row < gameStats.length; row++){
            for (let col = 0; col < gameStats[row].length; col++){
                const newCell = document.createElement('div')
                newCell.setAttribute('data-col', col)
                newCell.setAttribute('data-row', row)
                newCell.textContent = gameStats[row][col]
                board.appendChild(newCell)
            }
        }
    }

    function boardClickHandler(e) {
        if (gameStats[e.target.dataset.row][e.target.dataset.col] !== null) {
            return null
        }
        const playerTurn = history[history.length-1] === 'X'
            ? 'O'
            : 'X'
        history.push(playerTurn)
        gameStats[e.target.dataset.row][e.target.dataset.col] = playerTurn
        render()
        if (history.length >= 5) {
            if (checkWinner() === true) {
                announceWinner()
                resetBoard()
                if (playerTurn === 'X') {
                    playerX.win()
                    playerX.scoreInfo()
                } else if (playerTurn === 'O') {
                    playerO.win()
                    playerO.scoreInfo()
                }
            }
        }
    }

    function resetBoard() {
        gameStats = [
            [null,null,null],
            [null,null,null],
            [null,null,null]
        ]
        render()
    }

    function checkWinner() {
        const lastMove = history[history.length-1]
        // check row and col
        for (let i = 0; i < gameStats.length; i++){
            checkCol:
            for (let j = 0; j < gameStats[i].length; j++){
                switch (true) {
                    case (gameStats[i][j] != lastMove):
                        break checkCol
                    case j === gameStats[i].length-1:
                        return true
                }
            }
            checkRow:
            for (let j = 0; j < gameStats[i].length; j++){
                switch (true) {
                    case (gameStats[j][i] != lastMove):
                        break checkRow
                    case j === gameStats[i].length-1:
                        return true
                }
            }
            checkDia1:
            for (let j = 0; j < gameStats[i].length; j++){
                switch (true) {
                    case (gameStats[j][j] != lastMove):
                        break checkDia1
                    case j === gameStats[i].length-1:
                        return true
                }
            }
            checkDia2:
            for (let j = 0; j < gameStats[i].length; j++){
                switch (true) {
                    case (gameStats[gameStats[i].length - 1 - j][j] != lastMove):
                        break checkDia2
                    case j === gameStats[i].length-1:
                        return true
                }
            }
        }
        return false
    }

    function announceWinner() {
        const winner = history[history.length-1]
        const newAnnouncement = document.createElement('div')
        newAnnouncement.textContent = `${winner} WINS!`
        announcementBoard.appendChild(newAnnouncement)
        setTimeout(()=>{
            announcementBoard.removeChild(newAnnouncement)
        },3000)
    }

    return {
    }
})()

const infoBoard = (()=> {
    // cache DOM
    const announcementBoard = document.querySelector('.announcement')
    const playerX = document.querySelector('.playerX')
    const playerO = document.querySelector('.playerO')

    // bind events

    render()
    
    // methods
    function render() {
        const 
    }
    return {}
})()


const player = (arg) => {
    const name = arg
    let score = 0
    const win = () => {
        score++
    }
    const scoreInfo = () => {
        console.log(score)
    }
    return {
        scoreInfo,
        win
    }
}

const playerX = player('X')
const playerO = player('O')

console.log(playerX)
const pubSub = (()=> {
    let events = {}
    const subscribe = (eventName, fn) => {
      events[eventName] = events[eventName] || [];
      events[eventName].push(fn);
    }

    const unsubscribe = (eventName, fn) => {
      if (events[eventName]) {
        for (let i = 0; i < events[eventName].length; i++) {
          if (events[eventName][i] === fn) {
            events[eventName].splice(i, 1);
            break;
          }
        };
      }
    }

    const publish = (eventName, data)=> {
      if (events[eventName]) {
        events[eventName].forEach((fn)=> {
          fn(data);
        });
      }
    }
    return {
        subscribe, unsubscribe, publish, events
    }
})()