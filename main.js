const player = (arg) => {
    const _playerName = arg
    let _score = 0    
    let _brain = 'human'

    const score = (arg) => {
        return arg
            ? _score = arg
            : _score
    }

    const brain = (arg) => {
        return arg
            ? _brain = arg
            : _brain
    }

    // export
    return {
        score,
        brain,
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
    
    const players = (arg) => {
        return arg
            ? _players = arg
            : _players
    }

    const board = (arg) => {
        return arg
            ? _board = arg
            : _board
    }

    const turnCount = () => {
        return _turnCount
    }
    const setTurnCount = (arg) => {
        _turnCount = arg
        return arg
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

    const resetBoard = () => {
        _board = [
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ]
        _turnCount = 0
    }

    return {
        players,
        board,
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

const view = (() => {
    const boardCells = (arg) => {
        return arg
            ? [...document.querySelectorAll('.cell')].map((item, index)=> {
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
            : [...document.querySelectorAll('.cell')].map(item=> item.textContent)
    }

    const playerXScore = (arg) => {
        return arg
            ? document.querySelector('.player-x-score').textContent = arg
            : document.querySelector('.player-x-score').textContent
    }

    const playerOScore = (arg) => {
        return arg
            ? document.querySelector('.player-o-score').textContent = arg
            : document.querySelector('.player-o-score').textContent
    }

    const playerOBrain = (arg) => {
        return arg
            ? document.querySelector('#player-o-setting').value = arg
            : document.querySelector('#player-o-setting').value
    }

    const playerXBrain = (arg) => {
        return arg
            ? document.querySelector('#player-x-setting').value = arg
            : document.querySelector('#player-x-setting').value
    }

    const blur = () => {
        document.querySelector('.tictactoe-container').classList.value.match('blur')
            ? document.querySelector('.tictactoe-container').classList.remove('blur')
            : document.querySelector('.tictactoe-container').classList.add('blur')
    }

    const cellsAngle = (arg) => {
        return arg
            ? document.querySelector(':root').style.setProperty('--cells-rotate', `${arg}deg`)
            : +document.querySelector(':root').style.getPropertyValue('--cells-rotate').replace('deg','')
    }

    const notification = (arg) => {
        return arg
            ? document.querySelector('.announcement').textContent = arg
            : document.querySelector('.announcement').textContent
        
    }
    return {
        boardCells,
        playerXScore,
        playerOScore,
        playerOBrain,
        playerXBrain,
        blur,
        cellsAngle,
        notification
    }
})()


const displayController = (() => {
    // cache DOM
    const board = document.querySelector('.tictactoe-container')
    const playerXSetting = document.querySelector('#player-x-setting')
    const playerOSetting = document.querySelector('#player-o-setting')

    const renderBoard = (arg) => {
        view.boardCells(arg)
    }

    const resetGame = () => {
        gameBoard.setTurnCount('reset')
        view.blur()
        setTimeout(()=> {
            gameBoard.resetBoard()
            view.boardCells(gameBoard.board())
            view.notification(' ')
            view.blur()
            playerTurn()
        },2000)
    }
    
    const playerXSettingHandler = () => {
        playerX.brain(view.playerXBrain())
        resetGame()
    }
    
    const playerOSettingHandler = () => {
        playerO.brain(view.playerOBrain())
        resetGame()
    }
    const disableClick = () => {
        board.removeEventListener('pointerdown', playerClickHandler)
    }

    const enableClick = () => {
        board.addEventListener('pointerdown', playerClickHandler)
    }

    const registerPlayerMove = (arg) => {
        disableClick()
        if (gameBoard.turnCount() === 'reset') return 
        // checking move, if board is not null, return
        if (gameBoard.board()[arg[0]][arg[1]] !== null) return playerTurn()

        // placing move on the board
        const player = gameBoard.players()[gameBoard.turnCount()%2]
        gameBoard.setTurnCount(gameBoard.turnCount() + 1)
        gameBoard.board()[arg[0]][arg[1]] = player
        view.boardCells(gameBoard.board())

        // find winner
        const winner  = gameBoard.winner(gameBoard.board())
        switch (true) {
            case winner === 'X':
                view.playerXScore(playerX.score(playerX.score()+1))
                view.notification(`${player} WON THE GAME !`)
                break
            case winner === 'O':
                view.playerOScore(playerO.score(playerO.score()+1))
                view.notification(`${player} WON THE GAME !`)
                break
            case winner === 'draw':
                view.notification('DRAW !')
                break
            default:
                // return if no winner is found
                playerTurn()
                return
        }
        // what to do after a winner is found
        resetGame()
    }
    
    const playerClickHandler = (e) => {
        registerPlayerMove([e.target.dataset.row, e.target.dataset.col])
    }


    const nextAIMove = (player, brain) => {
        setTimeout(()=>{
            switch (true) {
                case brain === 'easy':
                    registerPlayerMove(ai.easy(gameBoard.board(), player))
                    break
                case brain === 'normal':
                    registerPlayerMove(ai.normal(gameBoard.board(), player))
                    break
                case brain === 'hard':
                    registerPlayerMove(ai.hard(gameBoard.board(), player))
                    break
                case brain === 'god':
                    registerPlayerMove(ai.god(gameBoard.board(), player))
                    break
            }
        },1000)
    }

    const playerTurn = () => {
        const player = gameBoard.players()[gameBoard.turnCount()%2]
        view.cellsAngle(view.cellsAngle() - playerX.score() + playerO.score())
        // check brain, if it's human then allow for event listener for click
        switch (true) {
            case player === 'X':
                switch (true) {
                    case playerX.brain() === 'human':
                        enableClick()
                        break
                    default:
                        nextAIMove(player, playerX.brain())
                        break
                }
                break
            case player === 'O':
                switch (true) {
                    case playerO.brain() === 'human':
                        console.log('human')
                        enableClick()
                        break
                    default:
                        nextAIMove(player, playerO.brain())
                        break
                }
                break
        }
    }

    // bind events setting
    playerXSetting.addEventListener('change', playerXSettingHandler)
    playerOSetting.addEventListener('change', playerOSettingHandler)

    // bind events board
    

    // bind events

    // init
    const playerX = player('X')
    const playerO = player('O')
    playerO.brain(view.playerOBrain('hard'))
    playerX.brain(view.playerXBrain('human'))
    playerTurn()

    return{
        renderBoard,
    }
})()