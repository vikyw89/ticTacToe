const pubSub = (() => {
    let events = {}
    
    // methods
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
    let brain = 'human'
    let score = 0

    // cache dom
    const playerScore = document.querySelector(`.player-${name.toLowerCase()}-score`)

    // methods
    const render = () => {
        playerScore.textContent = score
    }

    const playerMove = (arg) => {
        if (arg !== name) return
        switch (true) {
            case brain === 'human':
                console.log('human')
                pubSub.emit('humanTurn')
                break
            case brain === 'easy-ai':
                setTimeout(()=>{
                    console.log('easy-ai')
                    pubSub.emit('easyAiTurn')
                },1000)
                break
            case brain === 'random-ai':
                setTimeout(()=>{
                    console.log('random-ai')
                    pubSub.emit('randomAiTurn')
                },1000)
                break
        }
    }

    const setScore = (winner)=> {
        if (name === winner) {
            score++
            render()
        }
    }

    const updateBrain = (arg) => {
        brain = arg[name.toLowerCase()] ?? brain
    }

    // events handler

    // bind events
    pubSub.on('playerWin', setScore)
    pubSub.on('playerTurn', playerMove)
    pubSub.on('playerBrain', updateBrain)

    // init
    render()
}

const playerX = player('X')
const playerO = player('O')

const gameBoard = (()=> {
    // variables
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

    const playerTurn = () => {
        const turn = players[turnCount%2]
        turnCount++
        pubSub.emit('playerTurn', turn)
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
        playerTurn()
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

    const getGameStats = () => {
        return gameStats
    }

    const registeringPlayerMove = (e) => {
        board.removeEventListener('click', registeringPlayerMove)
        if (gameStats[e.target.dataset.row][e.target.dataset.col] !== null) return waitingForMove()
        const turn = players[(turnCount -1 )%2]
        gameStats[e.target.dataset.row][e.target.dataset.col] = turn
        render()
        if (turnCount < 5) return playerTurn()
        switch (true) {
            case checkWinner() && turn === 'X':
                pubSub.emit('playerWin', 'X')
                pubSub.emit('info', 'X won this round !')
                reset()
                break
            case checkWinner() && turn === 'O':
                pubSub.emit('playerWin', 'O')
                pubSub.emit('info', 'O won this round !')
                reset()
                break
            case checkWinner() === false && turnCount === 9:
                pubSub.emit('info', 'Draw !')
                reset()
                break
            default:
                playerTurn()
                break
        }
    }

    const waitingForMove = () => {
        board.addEventListener('click', registeringPlayerMove)
    }

    // bind events
    // board.addEventListener('click', boardClickHandler)
    pubSub.on('blur', blur)
    pubSub.on('playerTurn', waitingForMove)
    pubSub.on('playerBrain', reset)

    // init
    render()
    playerTurn()

    return {
        getGameStats
    }
})()

const easyAI = (() => {
    // variables

    // cacheDOM
    // methods
    const findNextMove = () => {
        const gameStats = gameBoard.getGameStats()
        for (let i = 0; i < gameStats.length; i++){
            for (let j = 0; j < gameStats[i].length; j++){
                if (gameStats[i][j] === null) {
                    const aiNextMove = document.querySelector(`div[data-row='${i}'][data-col='${j}']`)
                    pubSub.emit('playerTurn')
                    aiNextMove.click()
                    return
                }
            }
        }

    }

    // bind events
    pubSub.on('easyAiTurn', findNextMove)
    // init
})()

const randomAI = (() => {
    // variables
    let gameStats = gameBoard.getGameStats()
    let availableMoves = []
    // cacheDOM
    // methods
    const findNextMove = () => {
        console.log(availableMoves)

    }

    const updateAvailableMove = () => {
        gameStats = gameBoard.getGameStats()
        for (let i = 0; i < gameStats.length; i++){
            for (let j = 0; j < gameStats[i].length; j++){
                if (gameStats[i][j] === null) {
                    availableMoves.push([i,j])
                }
            }
        }
        findNextMove()
    }

    // bind events
    pubSub.on('randomAiTurn', updateAvailableMove)

    // init
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
    let playerXBrain = 'human'
    let playerOBrain = 'human'

    // cache dom
    const roleSelection = document.querySelectorAll('.settings > * > select')

    // method
    const updateBrain = (e) => {
        const [player] = e.target.id.match(/(?<=[-])[ox](?=[-])/g)
        const brain = e.target.value
        const updatedBrain = {[player]:brain}
        pubSub.emit('playerBrain', updatedBrain)
    }

    // bind events
    roleSelection.forEach(element=> {
        element.addEventListener('change', updateBrain)
    })
    // init
})()