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
        // Input board and players
        // Return winner name if there's any
        let tally = JSON.stringify(board)
        const players = ["X","O"]

        // check winner
        for (let player of players) {
            const rowWinner = (tally.match(new RegExp(`"${player}","${player}","${player}"`,'g'))??[]).length >= 1
            if (rowWinner) return player
            const firstColWinner = (tally.match(new RegExp(`[[]"${player}"`,'g'))??[]).length === 3
            if (firstColWinner) return player
            const secondColWinner = (tally.match(new RegExp(`,"${player}",`,'g'))??[]).length === 3
            if (secondColWinner) return player
            const lastColWinner = (tally.match(new RegExp(`"${player}"\]`,'g'))??[]).length === 3
            if (lastColWinner) return player
            const topLeftBotRight = (tally.match(new RegExp(`[[]{2}"${player}",.+\],[[].+,"${player}",.+\],[[].+,"${player}"\]{2}`,'g'))??[]).length === 1
            if (topLeftBotRight) return player
            const botLeftTopRight = (tally.match(new RegExp(`[[]{2}.+,"${player}"\],[[].+,"${player}",.+\],[[]"${player}".+\]{2}`,'g'))??[]).length === 1
            if (botLeftTopRight) return player
        }

        // check draw
        const draw = (tally.match(new RegExp(`null`))??[]).length === 0
        if (draw) return `draw`
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

    const god = (board, player) => {
        return hard(board, player)
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

    //     const minMax = (board, isMaximizing, player) => {
    //     console.log(board, isMaximizing, player)
    //     const score = {
    //         win: 1,
    //         lose: -1,
    //         draw: 0
    //     }
    //     isMaximizing === true 
    //         ? isMaximizing = false
    //         : isMaximizing = true
    //     let moveScore
    //     let bestScore
    //     let bestMove = {}
    //     // break condition, return score min or max depends on the turn decided by isMaximizing
    //     if (checkWinner(board, player)) {
    //         console.log('checkwiner true', board, player, checkWinner(board, player))
    //         bestScore = score[checkWinner(board,player)]
    //         return {bestScore, bestMove}
    //     }
    //     console.log('no winner')
    //     return {bestScore, bestMove}
    //     // if (isMaximizing === true) {
    //     //     bestScore = -Infinity
    //     //     // iterate the board to make move on available move
    //     //     // score each move
    //     //     // keep the highest score
    //     //     for (let i = 0; i < board.length; i++) {
    //     //         for(let j = 0; j < board[i].length; j++) {
    //     //             if (board[i][j] === null) {
    //     //                 board[i][j] = player
    //     //                 moveScore = score[minMax(board, isMaximizing, player).bestScore]
    //     //                 if (moveScore > bestScore) {
    //     //                     bestScore = moveScore
    //     //                     bestMove = {i,j}
    //     //                 }
    //     //                 board[i][j] = null
    //     //             }
    //     //         }
    //     //     }
    //     //     return {bestScore, bestMove}
    //     // } else {
    //     //     bestScore = Infinity
    //     //     // iterate the board to make move on available move
    //     //     // score each move
    //     //     // keep the lowest score
    //     //     for (let i = 0; i < board.length; i++) {
    //     //         for(let j = 0; j < board[i].length; j++) {
    //     //             if (board[i][j] === null) {
    //     //                 board[i][j] = player
    //     //                 moveScore = score[minMax(board, isMaximizing, player).bestScore]
    //     //                 if (moveScore < bestScore) {
    //     //                     bestScore = moveScore
    //     //                     bestMove = {i,j}
    //     //                 }
    //     //                 board[i][j] = null
    //     //             }
    //     //         }
    //     //     }
    //     //     return {bestScore, bestMove}
    //     // }
    // }

    return {
        availableMoves,
        easy,
        normal,
        hard,
        god,
        aimWin,
        aimPreventLose,
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
        return arg
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

    // bind events
    _playerXBrain.addEventListener('change', ()=>{
        setPlayerXBrain(_playerXBrain.value)
        resetBoard()
        setNotification()
    })
    
    _playerOBrain.addEventListener('change', ()=>{
        setPlayerOBrain(_playerOBrain.value)
        resetBoard()
        setNotification()
    })

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
    const resetGame = () => {
        state.setTurnCount()
        state.blurToggle()
        setTimeout(()=> {
            state.resetBoard()
            state.notification()
            state.blurToggle()
            nextTurn()
        },2000)
    }

    const playerClickHandler = (e) => {
        registerPlayerMove([e.target.dataset.row, e.target.dataset.col])
    }

    const registerPlayerMove = (arg) => {
        const player = state.player()
        // catching AI delayed move when settings changed
        if (state.turnCount() === null) return
        
        // checking move, if board is not null, return
        if (state.board()[arg[0]][arg[1]] !== null) return playerTurn()

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
                    registerPlayerMove(ai.easy(state.board(), player))
                    break
                case brain === 'normal':
                    registerPlayerMove(ai.normal(state.board(), player))
                    break
                case brain === 'hard':
                    registerPlayerMove(ai.hard(state.board(), player))
                    break
                case brain === 'god':
                    registerPlayerMove(ai.god(state.board(), player))
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
                state.setCellsAngle((state.cellsAngle() - +state.playerXScore())%360)
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
                state.setCellsAngle((state.cellsAngle() + state.playerOScore())%360)
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
    
    // init
    state.setPlayerOBrain('hard')
    state.setPlayerXBrain('hard')
    nextTurn()
})()
