const pubSub = (() => {
    let events = {}
    const on = (eventName, fn) => {
      events[eventName] = events[eventName] || [];
      events[eventName].push(fn);
    }
    const off = (eventName, fn) => {
      if (events[eventName]) {
        for (let i = 0; i < events[eventName].length; i++) {
          if (events[eventName][i] === fn) {
            events[eventName].splice(i, 1);
            break;
          }
        }
      }
    }
    const emit = (eventName, data) => {
      if (events[eventName]) {
        events[eventName].forEach(function(fn) {
          fn(data);
        });
      }
    }
    return {
        on,
        off,
        emit
    }
})()

const player = (arg) => {
    const name = arg
    let score = 0

    // cache DOM
    const playerScore = document.querySelector(`.player-${name.toLowerCase()}-score`)

    // methods
    const render = () => {
        playerScore.textContent = score
    }

    const setScore = (winner)=> {
        if (name === winner) {
            score++
            render()
        }
    }

    const updateRole = () => {
        
    }

    // bind events
    pubSub.on('playerWin', setScore)
    
    // init
    render()
}

const playerX = player('X')
const playerO = player('O')


const gameBoard = (()=> {
    let gameStats = [
        [null,null,null],
        [null,null,null],
        [null,null,null]
    ]
    const players = ['X', 'O']
    let turnCount = 0

    // cache dom
    const board = document.querySelector('.tictactoe-container')
    const cells = document.querySelectorAll('.cell')
    
    // methods
    const render =()=> {
        board.innerHTML = ''
        for(let row = 0; row < gameStats.length; row++){
            for (let col = 0; col < gameStats[row].length; col++){
                const newCell = document.createElement('div')
                newCell.setAttribute('data-col', col)
                newCell.setAttribute('data-row', row)
                newCell.classList.add('cell')
                newCell.textContent = gameStats[row][col]
                if (newCell.textContent === 'X') {
                    newCell.setAttribute('class', 'font-effect-fire')
                } else if (newCell.textContent === 'O') {
                    newCell.setAttribute('class', 'font-effect-neon')
                }
                board.appendChild(newCell)
            }
        }
    }

    const boardClickHandler =(e)=> {
        if (gameStats[e.target.dataset.row][e.target.dataset.col] !== null) return 
        const playerTurn = players[turnCount%2]
        turnCount++
        gameStats[e.target.dataset.row][e.target.dataset.col] = playerTurn
        render()
        if (turnCount < 5) return
        switch (true) {
            case checkWinner() && playerTurn === 'X':
                pubSub.emit('playerWin', 'X')
                pubSub.emit('info', 'X won this round !')
                reset()
                break
            case checkWinner() && playerTurn === 'O':
                pubSub.emit('playerWin', 'O')
                pubSub.emit('info', 'O won this round !')
                reset()
                break
            case checkWinner() === false && turnCount === 9:
                pubSub.emit('info', 'Draw !')
                reset()
                break
        }
    }

    const reset =()=> {
        gameStats = [
            [null,null,null],
            [null,null,null],
            [null,null,null]
        ]
        turnCount = 0
        setTimeout(()=>{
            render()
        },3000)
    }

    const checkWinner =() =>{
        const lastMove = players[(turnCount-1)%2]
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

    const blur = (arg) => {
        board.classList.add('blur')
        setTimeout(()=>{
            board.classList.remove('blur')
        },arg)
    }
    
    const preventClick = (arg) => {
        board.removeEventListener('click', boardClickHandler)
        setTimeout(()=>{
            board.addEventListener('click', boardClickHandler)
        },arg)
    }

    const logger = (arg) => {
        console.log(arg)
    }

    // bind events
    board.addEventListener('click', boardClickHandler)
    pubSub.on('blur', blur)
    pubSub.on('preventClick', preventClick)
    
    // init
    render()

    pubSub.on('playerXRoleUpdate', logger)
    pubSub.on('playerORoleUpdate', logger)
})()

const infoBoard = (()=> {
    // variables
    let info = ''
    
    // cache DOM
    const announcementBoard = document.querySelector('.announcement')
    
    // methods
    const setInfo =(arg)=> {
        info = arg
        render()
    }
    
    const render =()=> {
        pubSub.emit('blur', 3000)
        pubSub.emit('preventClick', 3000)
        announcementBoard.textContent = info
        setTimeout(()=>{
            announcementBoard.textContent = ''
        },3000)
    }
    
    // bind events
    pubSub.on('info', setInfo)
    
    // init
})()

const settings = (() => {
    // variables
    let playerXRole = 'human'
    let playerORole = 'human'

    // cache dom
    const roleSelection = document.querySelectorAll('.settings > * > select')

    // method
    const updateRole = (e) => {
        switch (true) {
            case e.target.id === 'player-x-setting':
                playerXRole = e.target.value
                pubSub.emit('playerXRoleUpdate', playerXRole)
                break
            case e.target.id === 'player-o-setting':
                playerORole = e.target.value
                pubSub.emit('playerORoleUpdate', playerORole)
                break
        }
    }

    // bind events
    roleSelection.forEach(element=> {
        element.addEventListener('input', updateRole)
    })
    // init
})()