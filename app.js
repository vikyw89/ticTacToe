const player = (arg) => {
    const _playerName = arg
    let _brain = 'human'
    let _score = 0

    const _playerScore = document.querySelector(`.player-${_playerName.toLowerCase()}-score`)

    const _render = () => {
        _playerScore.textContent = _score
    }
    
    const setScore = ()=> {
        _score++
        _render()
    }
    
    const setBrain = (arg) => {
        return _brain = arg
    }
    
    const getBrain = () => {
        return _brain
    }

    return {
        setBrain,
        setScore,
        getBrain
    }
}

const playerX = player('X')
const playerO = player('O')

const gameBoard = (()=> {
    let _gameStats = [
        [null,null,null],
        [null,null,null],
        [null,null,null]
    ]
    const _players = ['X', 'O']
    let _turnCount = 0


    const _board = document.querySelector('.tictactoe-container')
    const _cells = document.querySelectorAll('.cell')
    

    const _render = () => {
        _board.innerHTML = ''
        for(let row = 0; row < _gameStats.length; row++){
            for (let col = 0; col < _gameStats[row].length; col++){
                const newCell = document.createElement('div')
                newCell.setAttribute('data-col', col)
                newCell.setAttribute('data-row', row)
                newCell.classList.add('cell')
                newCell.textContent = _gameStats[row][col]
                if (newCell.textContent === 'X') {
                    newCell.setAttribute('class', 'font-effect-fire')
                } else if (newCell.textContent === 'O') {
                    newCell.setAttribute('class', 'font-effect-neon')
                }
                _board.appendChild(newCell)
            }
        }
    }
    
    const turnOf = (_turnCount) => {
        return _players[_turnCount%2]
    }

    const _playerTurn = () => {
        const turn = turnOf(_turnCount)
        _turnCount++
        switch (true){
            case turn === 'X' && playerX.getBrain() === 'human':
                _enableClick()
                break
            case turn === 'O' && playerO.getBrain() === 'human':
                _enableClick()
                break
            case turn === 'X' && playerX.getBrain() !== 'human':
                ai.nextMove(playerX.getBrain())
                break
            case turn === 'O' && playerO.getBrain() !== 'human':
                ai.nextMove(playerO.getBrain())
                break
        }
    }
    
    const _enableClick = () => {
        _board.addEventListener('click', _clickHandler)
    }
    
    const _preventClick = () => {
        _board.removeEventListener('click', _clickHandler)
    }

    const registeringPlayerMove = (arg) => {
        const [row, col] = arg
        if (_gameStats[row][col] !== null) return _enableClick()
        const turn = _players[(_turnCount -1 )%2]
        _gameStats[row][col] = turn
        _render()
        if (_turnCount < 5) return _playerTurn()
        switch (true) {
            case checkWinner(_gameStats, turn) && turn === 'X':
                notification.setNotif('X WON THIS ROUND !')
                playerX.setScore()
                _reset()
                break
            case checkWinner(_gameStats, turn) && turn === 'O':
                notification.setNotif('O WON THIS ROUND !')
                playerO.setScore()
                _reset()
                break
            case checkWinner(_gameStats, turn) === false && _turnCount === 9:
                notification.setNotif('DRAW !')
                _reset()
                break
            default:
                _playerTurn()
                break
        }
    }
    
    const checkWinner = (board, player) =>{
        // check row and col
        for (let i = 0; i < board.length; i++){
            checkCol:
            for (let j = 0; j < board[i].length; j++){
                switch (true) {
                    case (board[i][j] !== player):
                        break checkCol
                    case j === board[i].length-1:
                        return true
                }
            }
            checkRow:
            for (let j = 0; j < board[i].length; j++){
                switch (true) {
                    case (board[j][i] !== player):
                        break checkRow
                    case j === board[i].length-1:
                        return true
                }
            }
            checkDia1:
            for (let j = 0; j < board[i].length; j++){
                switch (true) {
                    case (board[j][j] !== player):
                        break checkDia1
                    case j === board[i].length-1:
                        return true
                }
            }
            checkDia2:
            for (let j = 0; j < board[i].length; j++){
                switch (true) {
                    case (board[board[i].length - 1 - j][j] !== player):
                        break checkDia2
                    case j === board[i].length-1:
                        return true
                }
            }
        }
        return false
    }

    const _reset =()=> {
        _gameStats = [
            [null,null,null],
            [null,null,null],
            [null,null,null]
        ]
        _turnCount = 0
        _blurBoard()
        setTimeout(()=>{
            _render()
            _playerTurn()
            _unBlurBoard()
        },3000)
    }
    
    const getGameStats = () => {
        return _gameStats
    }
    
    const _blurBoard = () => {
        _board.classList.add('blur')
    }

    const _unBlurBoard = () => {
        _board.classList.remove('blur')
    }
    
    const resumeGame = () => {
        _preventClick()
        _turnCount--
        _playerTurn()
    }

    const _clickHandler = (e) => {
        _preventClick()
        const [row, col] = [e.target.dataset.row, e.target.dataset.col]
        registeringPlayerMove([row, col])
    }

    _render()
    _playerTurn()

    return {
        getGameStats,
        resumeGame,
        registeringPlayerMove,
        checkWinner,
        turnOf
    }
})()

const ai = (() => {
    let _availableMoves = []
    let _selectedMoves = ''

    const _updateAvailableMoves = (gameStats) => {
        _availableMoves = []
        for (let i = 0; i < gameStats.length; i++){
            for (let j = 0; j < gameStats[i].length; j++){
                if (gameStats[i][j] === null) {
                    const aiNextMove = [i,j]
                    _availableMoves.push(aiNextMove)
                }
            }
        }
        return _availableMoves
    }

    const nextMove = (arg) => {
        _updateAvailableMoves(gameBoard.getGameStats())
        switch (true) {
            case arg === 'easy':
                console.log('test')
                _easy()
                break
            case arg === 'random':
                _random()
                break
            case arg === 'impossible':
                _impossible(gameBoard.getGameStats(), gameBoard.turnOf())
                break
        }
        const [row, col] = [_selectedMoves[0], _selectedMoves[1]]
        setTimeout(()=>{
            gameBoard.registeringPlayerMove([row, col])
        },1000)
    }

    const _easy = () => {
        console.log(_selectedMoves)
        _selectedMoves = _availableMoves[0]
    }

    const _random = () => {
        return _selectedMoves = _availableMoves[Math.floor(Math.random() * _availableMoves.length)]
    }

    const minMax = (board, isMaximizing, turn) => {
        const value = {
            true: 1,
            false: -1,
        }
        let result = gameBoard.checkWinner(board, turn)
        return -1
    }

    const _impossible = (board, turn) => {
        console.log(board, turn)
        let maxScore = -Infinity
        let bestMove = []

        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j] === null) {
                    board[i][j] = `${turn}`
                    // check for score for particular move
                    let score = minMax(board, true, turn)
                    board[i][j] = null
                    if (score > maxScore) {
                        maxScore = score
                        bestMove = [i,j]
                    }
                }
            }
        }
        return _selectedMoves = bestMove
    }
    return {
        nextMove
    }
})()

const notification = (()=> {
    // variables
    let notif = ''
    
    // cache DOM
    const notifBoard = document.querySelector('.announcement')
    
    // methods
    const setNotif =(arg)=> {
        notif = arg
        _render()
    }
    
    const _render =()=> {
        notifBoard.textContent = notif
        setTimeout(()=>{
            notifBoard.textContent = ''
        },3000)
    }
    
    // bind events
    // init
    return {
        setNotif
    }
})()

const settings = (() => {
    // cache dom
    const brainSelection = document.querySelectorAll('.settings > * > select')

    // methods
    const changeHandler = (e) => {
        const [player] = e.target.id.match(/(?<=[-])[ox](?=[-])/g)
        const brain = e.target.value
        switch (true) {
            case player === 'x':
                playerX.setBrain(brain)
                gameBoard.resumeGame()
                break
            case player === 'o':
                playerO.setBrain(brain)
                gameBoard.resumeGame()
                break
        }
    }

    // bind events
    brainSelection.forEach(element=> {
        element.addEventListener('change', changeHandler)
    })

    return {
    }
})()