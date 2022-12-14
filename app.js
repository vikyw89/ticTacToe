const player = (arg) => {
    const _playerName = arg
    let _score = 0
    let _brain = 'random'

    // cache DOM
    const _playerScore = document.querySelector(`.player-${_playerName.toLowerCase()}-score`)

    // methods
    const score = () => {
        return _score
    }

    const setScore = (arg)=> {
        _score = arg
        _render()
        return _score
    }
    
    const brain = () => {
        return _brain
    }

    const setBrain = (arg) => {
        _brain = arg
        _render()
        return _brain
    }
    
    const _render = () => {
        _playerScore.textContent = _score
    }

    // export
    return {
        score,
        setScore,
        brain,
        setBrain,
    }
}

const playerX = player('X')
const playerO = player('O')

const ai = (() => {
    const _updateAvailableMoves = (board) => {
        _availableMoves = []
        for (let i = 0; i < board.length; i++){
            for (let j = 0; j < board[i].length; j++){
                if (board[i][j] === null) {
                    const aiNextMove = [i,j]
                    _availableMoves.push(aiNextMove)
                }
            }
        }
        return _availableMoves
    }

    const nextMove = (arg) => {
        let [board, brain, currentPlayer] = arg
        let _selectedMoves = []
        switch (true) {
            case brain === 'easy':
                _selectedMoves = _easy(board)
                break
            case brain === 'random':
                _selectedMoves = _random(board)
                break
            case brain === 'impossible':
                _selectedMoves = _impossible(board, currentPlayer)
                break
        }
        const [row, col] = [_selectedMoves[0], _selectedMoves[1]]
        setTimeout(()=>{
            gameBoard.registeringPlayerMove([row, col])
        },1000)
    }

    const _easy = (board) => {
        return _updateAvailableMoves(board)[0]
    }

    const _random = (board) => {
        let _availableMoves = _updateAvailableMoves(board)
        return _availableMoves[Math.floor(Math.random() * _availableMoves.length)]
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
    return {
        nextMove,
        checkWinner
    }
})()

const gameBoard = (()=> {
    let _players = ['X', 'O']
    let _board = [
        [null,null,null],
        [null,null,null],
        [null,null,null]
    ]
    let _turnCount = 0
    let _currentPlayer = _players[_turnCount]
    let _blurToggle = false
    let _cellClickToggle = false

    // cache DOM
    const _boardContainer = document.querySelector('.tictactoe-container')
    const _cells = document.querySelectorAll('.cell')
    
    // methods
    const players = () => {
        return _players
    }

    const setPlayers = (arg) => {
        _players = arg
        _render()
        return _players
    }

    const board = () => {
        return _board
    }

    const setBoard = (arg) => {
        _board = arg
        _render()
        return _board
    }

    const turnCount = () => {
        return _turnCount
    }

    const setTurnCount = (arg) => {
        _turnCount = arg
        setCurrentPlayer(_players[_turnCount%2])
        _render()
        return _turnCount
    }

    
    const currentPlayer = () => {
        return _currentPlayer
    }
    
    const setCurrentPlayer = (arg) => {
        _currentPlayer = arg
        _render()
        return _currentPlayer
    }
    
    const _playerTurn = () => {
        const turn = currentPlayer()
        switch (true){
            case turn === 'X' && playerX.brain() === 'human':
                cellClickToggle()
                break
            case turn === 'O' && playerO.brain() === 'human':
                cellClickToggle()
                break
            case turn === 'X' && playerX.brain() !== 'human':
                ai.nextMove([_board, playerX.brain(), _currentPlayer])
                break
            case turn === 'O' && playerO.brain() !== 'human':
                ai.nextMove([_board, playerO.brain(), _currentPlayer])
            break
        }
    }
    
    const cellClickToggle = () => {
        if (_cellClickToggle === false) {
            _cellClickToggle = true
            _boardContainer.addEventListener('pointerdown', _clickHandler)
        } else {
            _cellClickToggle = false
            _boardContainer.removeEventListener('pointerdown', _clickHandler)
        }
    }
    
    const registeringPlayerMove = (arg) => {
        const [row, col] = arg
        if (_board[row][col] !== null) return _playerTurn()
        const turn = _players[(_turnCount)%2]
        _board[row][col] = turn
        setTurnCount(_turnCount + 1)
        _render()
        if (_turnCount < 5) return _playerTurn()
        switch (true) {
            case ai.checkWinner(_board, turn) && turn === 'X':
                notification.setNotif('X WON THIS ROUND !')
                playerX.setScore(playerX.score() + 1)
                _reset()
                break
            case ai.checkWinner(_board, turn) && turn === 'O':
                notification.setNotif('O WON THIS ROUND !')
                playerO.setScore(playerO.score() + 1)
                _reset()
                break
            case ai.checkWinner(_board, turn) === false && _turnCount === 9:
                notification.setNotif('DRAW !')
                _reset()
                break
            default:
                _playerTurn()
                break
        }
    }
                    
    
    const _reset =()=> {
        _board = [
            [null,null,null],
            [null,null,null],
            [null,null,null]
        ]
        _turnCount = 0
        blurToggle()
        setTimeout(()=>{
            _render()
            _playerTurn()
            blurToggle()
        },3000)
    }

    const _render = () => {
        _cells.forEach(element => {
            const [row,col] = [element.dataset.row, element.dataset.col]
            element.textContent = ''
            element.classList.remove('font-effect-fire')
            element.classList.remove('font-effect-fire')
            switch (true) {
                case _board[row][col] === 'X':
                    element.textContent = 'X'
                    element.classList.add('font-effect-fire')
                    break
                case _board[row][col] === 'O':
                    element.textContent = 'O'
                    element.classList.add('font-effect-neon')
                    break
            }
        })
    }
    
    const blurToggle = () => {
        if (_blurToggle === false) {
            _blurToggle = true
            _boardContainer.classList.add('blur')
        } else {
            _blurToggle = false
            _boardContainer.classList.remove('blur')
        }
    } 
    
    const resumeGame = () => {
        cellClickToggle()
        _playerTurn()
    }

    const _clickHandler = (e) => {
        cellClickToggle()
        const [row, col] = [e.target.dataset.row, e.target.dataset.col]
        registeringPlayerMove([row, col])
    }

    _render()
    _playerTurn()

    return {
        players,
        setPlayers,
        board,
        setBoard,
        turnCount,
        setTurnCount,
        currentPlayer,
        setCurrentPlayer,
        resumeGame,
        registeringPlayerMove,
        blurToggle
    }
})()

const notification = (()=> {
    let _notif = ''
    
    // cache DOM
    const notifBoard = document.querySelector('.announcement')
    
    // methods
    const notif = () => {
        return _notif
    }

    const setNotif = (arg)=> {
        _notif = arg
        _render()
    }
    
    const _render =()=> {
        notifBoard.textContent = _notif
        setTimeout(()=>{
            notifBoard.textContent = ''
        },3000)
    }
    
    // bind events
    // init
    return {
        notif,
        setNotif,
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
    // init
    return {
    }
})()