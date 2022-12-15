const player = (arg) => {
    const _playerName = arg
    let _score = 0
    let _brain = 'human'

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
playerX.setBrain(document.querySelector('#player-x-setting').value)
playerO.setBrain(document.querySelector('#player-o-setting').value)

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
            case brain === 'normal':
                _selectedMoves = _normal(board, currentPlayer)
                break
            case brain === 'hard':
                _selectedMoves = _hard(board, currentPlayer)
                break
            case brain === 'god':
                _selectedMoves = _god(board, currentPlayer)
                break
        }
        return [_selectedMoves[0], _selectedMoves[1]]
    }

    const _easy = (board) => {
        const moves = _updateAvailableMoves(board)
        return moves[Math.floor(Math.random() * moves.length)]
    }

    const _normal = (board, player) => {
        return aimWin(board,player) ?? _easy(board)
    }

    const _hard = (board, player) => {
        // make a move
        // choose if there's a winner
        return aimWin(board,player) ?? aimPreventLose(board, player) ?? _easy(board)
    }

    const aimWin = (board, player) => {
        for (let i = 0; i < board.length ; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j] === null) {
                    board[i][j] = player
                    if (checkWinner(board, player) === 'win') {
                        console.log(`Player ${player} aimWin at`, i,j)
                        board[i][j] = null
                        return [i,j]
                    }
                    board[i][j] = null
                }
            }
        }
    }

    const aimPreventLose = (board, player) => {
        const opponent = player === 'X'
            ? 'O'
            : 'X'
        for (let i = 0; i < board.length ; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j] === null) {
                    board[i][j] = opponent
                    if (checkWinner(board, player) === 'lose') {
                        console.log(`Player ${player} aimPreventLose at`, i,j)
                        board[i][j] = null
                        return [i,j]
                    }
                    board[i][j] = null
                }
            }
        }
    }

    const minMax = (board, isMaximizing, player) => {
        console.log(board, isMaximizing, player)
        const score = {
            win: 1,
            lose: -1,
            draw: 0
        }
        isMaximizing === true 
            ? isMaximizing = false
            : isMaximizing = true
        let moveScore
        let bestScore
        let bestMove = {}
        // break condition, return score min or max depends on the turn decided by isMaximizing
        if (checkWinner(board, player)) {
            console.log('checkwiner true', board, player, checkWinner(board, player))
            bestScore = score[checkWinner(board,player)]
            return {bestScore, bestMove}
        }
        console.log('no winner')
        return {bestScore, bestMove}
        // if (isMaximizing === true) {
        //     bestScore = -Infinity
        //     // iterate the board to make move on available move
        //     // score each move
        //     // keep the highest score
        //     for (let i = 0; i < board.length; i++) {
        //         for(let j = 0; j < board[i].length; j++) {
        //             if (board[i][j] === null) {
        //                 board[i][j] = player
        //                 moveScore = score[minMax(board, isMaximizing, player).bestScore]
        //                 if (moveScore > bestScore) {
        //                     bestScore = moveScore
        //                     bestMove = {i,j}
        //                 }
        //                 board[i][j] = null
        //             }
        //         }
        //     }
        //     return {bestScore, bestMove}
        // } else {
        //     bestScore = Infinity
        //     // iterate the board to make move on available move
        //     // score each move
        //     // keep the lowest score
        //     for (let i = 0; i < board.length; i++) {
        //         for(let j = 0; j < board[i].length; j++) {
        //             if (board[i][j] === null) {
        //                 board[i][j] = player
        //                 moveScore = score[minMax(board, isMaximizing, player).bestScore]
        //                 if (moveScore < bestScore) {
        //                     bestScore = moveScore
        //                     bestMove = {i,j}
        //                 }
        //                 board[i][j] = null
        //             }
        //         }
        //     }
        //     return {bestScore, bestMove}
        // }
    }

    const _god = (board, player) => {
        return _hard(board, player)
    }

    const checkWinner = (board, player) =>{
        const opponent = player === 'X'
            ? 'O'
            : 'X'
        const available = 'available'

        let tally = {
            [player]: 0,
            [opponent]: 0,
            [available]: 0
        }
        for (let i = 0; i < board.length; i++){
            // checking row
            for (let j = 0; j < board[i].length; j++){
                switch (true) {
                    case board[i][j] === player:
                        tally[player]++
                        break
                    case board[i][j] === opponent:
                        tally[opponent]++
                        break
                    default:
                        tally[available]++
                        break
                }
            }
            if (tally[player] === 3) return 'win'
            else if (tally[opponent] === 3) return 'lose'
            tally[player] = 0
            tally[opponent] = 0

            // checking col
            for (let j = 0; j < board[i].length; j++){
                switch (true) {
                    case board[j][i] === player:
                        tally[player]++
                        break
                    case board[j][i] === opponent:
                        tally[opponent]++
                        break
                }
            }
            if (tally[player] === 3) return 'win'
            else if (tally[opponent] === 3) return 'lose'
            tally[player] = 0
            tally[opponent] = 0
        }
        // checking draw
        if (tally[available] === 0) return 'draw'


        // checking diagonal top left to bottom right
        for (let i = 0; i < board.length; i++) {
            switch (true) {
                case board[i][i] === player:
                    tally[player]++
                    break
                case board[i][i] === opponent:
                    tally[opponent]++
                    break
            }
        }
        if (tally[player] === 3) return 'win'
        else if (tally[opponent] === 3) return 'lose'
        tally[player] = 0
        tally[opponent] = 0

        // checking diagonal bottom left to top right
        for (let i = 0; i < board.length; i++) {
            switch (true) {
                case board[board.length-1-i][i] === player:
                    tally[player]++
                    break
                case board[board.length-1-i][i] === opponent:
                    tally[opponent]++
                    break
            }
        }
        if (tally[player] === 3) return 'win'
        else if (tally[opponent] === 3) return 'lose'
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
    let _cellsAngle = 0

    // cache DOM
    const _boardContainer = document.querySelector('.tictactoe-container')
    const _cells = document.querySelectorAll('.cell')
    const r = document.querySelector(':root');
    
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
    
    const cellsAngle = () => {
        return _cellsAngle
    }

    const setCellAngle = (arg) => {
        _cellsAngle = arg
        r.style.setProperty('--cells-rotate', `${arg}deg`);
        return _cellsAngle
    }


    const _playerTurn = () => {
        setCellAngle(_cellsAngle + (playerO.score()-playerX.score()))
        const turn = currentPlayer()
        switch (true){
            case turn === 'X' && playerX.brain() === 'human':
                _enableClick()
                break
            case turn === 'O' && playerO.brain() === 'human':
                _enableClick()
                break
            case turn === 'X' && playerX.brain() !== 'human':
                setTimeout(()=>{
                    registeringPlayerMove(ai.nextMove([_board, playerX.brain(), _currentPlayer]))
                },1000)
                break
            case turn === 'O' && playerO.brain() !== 'human':
                setTimeout(()=>{
                    registeringPlayerMove(ai.nextMove([_board, playerO.brain(), _currentPlayer]))
                },1000)
            break
        }
    }

    const _disableClick = () => {
        _boardContainer.removeEventListener('pointerdown', _clickHandler)
    }

    const _enableClick = () => {
        _boardContainer.addEventListener('pointerdown', _clickHandler)
    }
    
    const registeringPlayerMove = (arg) => {
        if (_turnCount === null) return 
        const [row, col] = arg
        if (_board[row][col] !== null) return _playerTurn()
        const turn = _players[(_turnCount)%2]
        console.log(`Registering player ${turn} moves at ${arg}`)
        _board[row][col] = turn
        setTurnCount(_turnCount + 1)
        _render()
        if (_turnCount < 5) return _playerTurn()
        switch (true) {
            case ai.checkWinner(_board, turn) === 'win':
                notification.setNotif(`${turn} WON THIS ROUND !`)
                turn === 'X'
                    ? playerX.setScore(playerX.score() + 1)
                    : playerO.setScore(playerO.score() + 1)
                _reset()
                break
            case ai.checkWinner(_board, turn) === 'draw':
                notification.setNotif('DRAW !')
                _reset()
                break
            default:
                _playerTurn()
                break
        }
    }
                    
    
    const _reset =()=> {
        setTurnCount(null)
        blurToggle()
        _disableClick()
        setTimeout(()=>{
            setBoard([
                [null,null,null],
                [null,null,null],
                [null,null,null]
            ])
            setTurnCount(0)
            _playerTurn()
            blurToggle()
        },2000)
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
        _reset()
    }

    // const _populateBoard = (size) => {

    // }

    const _clickHandler = (e) => {
        _disableClick()
        const [row, col] = [e.target.dataset.row, e.target.dataset.col]
        registeringPlayerMove([row, col])
    }

    // init
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
        cellsAngle,
        setCellAngle,
        resumeGame,
        registeringPlayerMove,
        blurToggle,
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