const player = (arg) => {
    const _playerName = arg
    let _score = 0    
    let _brain = 'human'

    const score = () => {
        return +_score
    }

    const setScore = (arg) => {
        _score = arg
        return +_score
    }

    const brain = () => {
        return _brain
    }

    const setBrain = (arg) => {
        _brain = arg
        return _brain
    }

    // export
    return {
        score,
        setScore,
        brain,
        setBrain
    }
}

const gameBoard = (()=> {
    let _players = ['X', 'O']
    let _board = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ]
    let _turnCount = 0

    const player = ()=> {
        return _players[_turnCount % _players.length]
    }

    const players = () => {
        return _players
    }

    const setPlayers = (arg) => {
        _players = arg
        return arg
    }

    const board = () => {
        return _board
    }

    const setBoard = (arg) => {
        _board = arg
        return arg
    }

    const turnCount = () => {
        return _turnCount
    }

    const setTurnCount = (arg) => {
        _turnCount = arg
        return _turnCount
    }

    const resetBoard = () => {
        _board = [
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ]
        _turnCount = 0
    }

    const winner = (board) => {
        for (let i = 0; i < board.length; i++) {
            switch (true) {
                case board[i][0] && board[i][0] === board[i][1] && board[i][0] === board[i][2]:
                    return board[i][0]
                case board[0][i] && board[0][i] === board[1][i] && board[0][i] === board[2][i]:
                    return board[0][i]
            }
        }

        // check diagonal
        if (board[1][1]) {
            switch (true) {
                case board[1][1] === board[0][0] && board[1][1] === board[2][2]:
                    return board[1][1]
                case board[1][1] === board[2][0] && board[1][1] === board[0][2]:
                    return board[1][1]
            }
        }
        
        // check draw
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j <board.length; j++) {
                if (!board[i][j]) {
                    return
                }
            }
        }
        return 'draw'
    }

    return {
        player,
        players,
        setPlayers,
        board,
        setBoard,
        turnCount,
        setTurnCount,
        winner,
        resetBoard,
    }
})()

const ai = (()=> {
    const availableMoves = (board) => {
        let result = []
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                board[i][j] ?? result.push([i,j])
            }
        }
        return result
    }

    const easy = (board, player) => {
        const moves = availableMoves(board)
        return moves[Math.floor(Math.random() * moves.length)]
    }
    
    const normal = (board, player) => {
        return aimWin(board,player) ?? easy(board)
    }

    const hard = (board, player) => {
        return aimWin(board,player) ?? aimPreventLose(board, player) ?? easy(board)
    }

    const aimWin = (board, player) => {
        for (let i = 0; i < board.length ; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j] === null) {
                    board[i][j] = player
                    if (gameBoard.winner(board) === player) {
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
                    if (gameBoard.winner(board) === opponent) {
                        console.log(`Player ${player} aimPreventLose at`, i,j)
                        board[i][j] = null
                        return [i,j]
                    }
                    board[i][j] = null
                }
            }
        }
    }

    const minMax = (board, depth, player, max) => {
        let opponent
        if (player === 'X') {
            opponent = 'O'
        } else {
            opponent = 'X'
        }

        const scoreTranslate = {
            [player]:1,
            [opponent]:-1,
            draw:0
        }

        let bestScore = scoreTranslate[gameBoard.winner(board)]

        // break condition
        if (gameBoard.winner(board) || depth === 0) {
            return bestScore
        }
        
        // toggle maiximizing to minimizing and vice versa
        switch (true) {
            case max:
                bestScore = -Infinity
                for (let i = 0; i < board.length; i++) {
                    for (let j = 0; j < board[i].length; j++) {
                        if (!board[i][j]) {
                            board[i][j] = player
                            score = minMax(board, depth - 1, player, !max)
                            board[i][j] = null
                            if (bestScore < score) {
                                bestScore = score
                            }
                        }
                    }
                }
                return bestScore
            case !max:
                bestScore = Infinity
                for (let i = 0; i < board.length; i++) {
                    for (let j = 0; j < board[i].length; j++) {
                        if (!board[i][j]) {
                            board[i][j] = opponent
                            score = minMax(board, depth - 1, player, !max)
                            board[i][j] = null
                            if (bestScore > score) {
                                bestScore = score
                            }
                        }
                    }
                }
                return bestScore
        }
    }

    const minMaxAI = (board, player, depth) => {
        // making moves on null space and score it using minmax
        let bestMove = []
        let bestScore = -Infinity
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (!board[i][j]) {
                    board[i][j] = player
                    let score = minMax(board, depth, player, false)
                    board[i][j] = null
                    if (bestScore < score) {
                        bestScore = score
                        bestMove = [i,j]
                    }
                }
            }
        }
        return bestMove
    }
      
  
  
    return {
        availableMoves,
        easy,
        normal,
        hard,
        aimWin,
        aimPreventLose,
        minMaxAI,
    }
})()

// database
const database = (() => {
    const localStorage = (arg) => {
        return arg
            ? window.localStorage = arg
            : window.localStorage
    }

    const sessionStorage = (arg) => {
        return arg
            ? window.sessionStorage = arg
            : window.sessionStorage
    }

    return {
        localStorage,
        sessionStorage,
    }
})()

// init objects
const playerX = player('X')
const playerO = player('O')

const state = (() => {
    // cache DOM
    const _playerXScore = document.querySelector('.player-x-score')
    const _playerOScore = document.querySelector('.player-o-score')
    const _playerXBrain = document.querySelector('#player-x-setting')
    const _playerOBrain = document.querySelector('#player-o-setting')
    const _board = document.querySelector('.tictactoe-container')
    const _cells = document.querySelectorAll('.cell')
    const _notification = document.querySelector('.announcement')
    const _root = document.querySelector(':root')

    // methods
    const playerXScore = () => {
        return playerX.score()
    }

    const setPlayerXScore = (arg) => {
        playerX.setScore(arg)
        _playerXScore.textContent = arg
        return playerX.score()
    }

    const playerOScore = () => {
        return playerO.score()
    }

    const setPlayerOScore = (arg) => {
        playerO.setScore(arg)
        _playerOScore.textContent = arg
        return playerO.score()
    }

    const playerXBrain = () => {
        return playerX.brain()
    }

    const setPlayerXBrain = (arg) => {
        playerX.setBrain(arg)
        _playerXBrain.value = arg
        return playerX.brain()
    }

    const playerOBrain = () => {
        return playerO.brain()
    }

    const setPlayerOBrain = (arg) => {
        playerO.setBrain(arg)
        _playerOBrain.value = arg
        return playerO.brain()
    }

    const board = () => {
        return gameBoard.board()
    }

    const setBoard = (arg) => {
        gameBoard.setBoard(arg)
        const temp = [..._cells].map((item, index)=> {
            const board = [...arg].reduce((result, value)=>{
                result = result.concat(value)
                return result
            })
            item.textContent = board[index]
            if (item.textContent === 'X') {
                item.classList.add('font-effect-fire')
            } else if (item.textContent === 'O') {
                item.classList.add('font-effect-neon')
            } else {
                item.classList.value = 'cell'
            }
            return board
        })
        return gameBoard.board()
    }

    const blurToggle = () => {
        _board.classList.value.match('blur')
            ? _board.classList.remove('blur')
            : _board.classList.add('blur')
    }

    const cellsAngle = () => {
        return +_root.style.getPropertyValue('--cells-rotate').replace('deg','')
    }

    const setCellsAngle = (arg) => {
        _root.style.setProperty('--cells-rotate', `${arg}deg`)
        return arg
    }

    const notification = () => {
        return _notification.textContent
    }

    const setNotification = (arg) => {
        _notification.textContent = arg
        return _notification.textContent
    }

    const resetBoard = () => {
        gameBoard.resetBoard()
        setBoard(board())
        return
    }

    const player = () => {
        return gameBoard.player()
    }

    const winner = () => {
        return gameBoard.winner(gameBoard.board())
    }

    const enableClick = (fn) => {
        _board.addEventListener('pointerdown', fn)
    }

    const disableClick = (fn) => {
        _board.removeEventListener('pointerdown', fn)
    }

    const turnCount = () => {
        return gameBoard.turnCount()
    }

    const setTurnCount = (arg) => {
        gameBoard.setTurnCount(arg)
        return gameBoard.turnCount()
    }

    // bind events
    _playerXBrain.addEventListener('change', ()=>{
        setPlayerXBrain(_playerXBrain.value)
    })
    
    _playerOBrain.addEventListener('change', ()=>{
        setPlayerOBrain(_playerOBrain.value)
    })

    // init

    return {
        playerXScore,
        setPlayerXScore,
        playerOScore,
        setPlayerOScore,
        playerOScore,
        setPlayerOScore,
        playerXBrain,
        setPlayerXBrain,
        playerOBrain,
        setPlayerOBrain,
        board,
        setBoard,
        blurToggle,
        cellsAngle,
        setCellsAngle,
        notification,
        setNotification,
        resetBoard,
        player,
        winner,
        enableClick,
        disableClick,
        turnCount,
        setTurnCount,
    }
})()

const displayController = (() => {
    // cache DOM
    const _playerXBrain = document.querySelector('#player-x-setting')
    const _playerOBrain = document.querySelector('#player-o-setting')

    const resetGame = () => {
        state.disableClick()
        state.setTurnCount('reset')
        state.blurToggle()
        setTimeout(()=> {
            state.resetBoard()
            state.setNotification()
            state.blurToggle()
            nextTurn()
        },2000)
    }

    const playerClickHandler = (e) => {
        registerPlayerMove([e.target.dataset.row, e.target.dataset.col])
        state.disableClick()
    }

    const registerPlayerMove = (arg) => {
        const player = state.player()
        // catching AI delayed move when settings changed
        if (state.turnCount() === 'reset') return
        
        // checking move, if board is not null, return
        if (state.board()[arg[0]][arg[1]] !== null) return nextTurn()

        // placing move on the board
        state.setTurnCount(state.turnCount() + 1)
        state.board()[arg[0]][arg[1]] = player
        state.setBoard(state.board())
        
        // find winner
        switch (true) {
            case state.winner() === 'X':
                state.setPlayerXScore(state.playerXScore() + 1)
                state.setNotification(`${player} WON THE GAME !`)
                break
            case state.winner() === 'O':
                state.setPlayerOScore(state.playerOScore() + 1)
                state.setNotification(`${player} WON THE GAME !`)
                break
            case state.winner() === 'draw':
                state.setNotification('DRAW !')
                break
            default:
                // return if no winner is found
                nextTurn()
                return
        }
        // what to do after a winner is found
        resetGame()
    }

    const nextAIMove = (player, brain) => {
        setTimeout(()=>{
            switch (true) {
                case brain === 'easy':
                    registerPlayerMove(ai.minMaxAI(state.board(), player, 1))
                    break
                case brain === 'normal':
                    registerPlayerMove(ai.minMaxAI(state.board(), player, 2))
                    break
                case brain === 'hard':
                    registerPlayerMove(ai.minMaxAI(state.board(), player, 3))
                    break
                case brain === 'god':
                    registerPlayerMove(ai.minMaxAI(state.board(), player, Infinity))
                    break
            }
        },1000)
    }

    const nextHumanMove = () => {
        state.enableClick(playerClickHandler)
        return
    }

    const nextTurn = () => {
        const player = state.player()
        
        // check brain, if it's human then allow for event listener for click
        switch (true) {
            case player === 'X':
                // rotate cells
                state.setCellsAngle((state.cellsAngle() - +state.playerXScore()%10)%360)
                switch (true) {
                    case state.playerXBrain() === 'human':
                        nextHumanMove()
                        break
                    default:
                        nextAIMove(player, state.playerXBrain())
                        break
                }
                break
            case player === 'O':
                // rotate cells
                state.setCellsAngle((state.cellsAngle() + state.playerOScore()%10)%360)
                switch (true) {
                    case state.playerOBrain() === 'human':
                        nextHumanMove()
                        break
                    default:
                        nextAIMove(player, state.playerOBrain())
                        break
                }
                break
        }
    }

    // bind events
    _playerOBrain.addEventListener('change', ()=>{
        resetGame()
    })
    _playerXBrain.addEventListener('change', ()=>{
        resetGame()
    })

    // init
    state.setPlayerXBrain('hard')
    state.setPlayerOBrain('hard')
    nextTurn()
})()
