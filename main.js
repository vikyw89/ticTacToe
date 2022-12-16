const pubSub = {
    events: {},
    subscribe: function(evName, fn) {
      console.log(`PUBSUB: someone just subscribed to know about ${evName}`);
      //add an event with a name as new or to existing list
      this.events[evName] = this.events[evName] || [];
      this.events[evName].push(fn);
    },
    unsubscribe: function(evName, fn) {
      console.log(`PUBSUB: someone just unsubscribed from ${evName}`);
      //remove an event function by name
      if (this.events[evName]) {
        this.events[evName] = this.events[evName].filter(f => f !== fn);
      }
    },
    publish: function(evName, data) {
      console.log(`PUBSUB: Making an broadcast about ${evName} with ${data}`);
      //emit|publish|announce the event to anyone who is subscribed
      if (this.events[evName]) {
        this.events[evName].forEach(f => {
          f(data);
        });
      }
    }
};

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

    const turnCount = (arg) => {
        return arg
            ? _turnCount = arg
            : _turnCount
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
            const topLeftBotRight = (tally.match(new RegExp(`[[]{2}"${player}",.+\],[[].+,"${player}",.+\],[[].+,"${player}",.+\]{2}`,'g'))??[]).length === 1
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
            : document.querySelector(':root').style.getPropertyValue('--cells-rotate').replace('deg', '')
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
        gameBoard.resetBoard()
        view.boardCells(gameBoard.board())
        view.blur()
        setTimeout(()=> {
            view.notification(' ')
            view.blur()
        },2000)
    }

    const playerXSettingHandler = () => {
        playerX.brain(view.playerOBrain())
        resetGame()
    }

    const playerOSettingHandler = () => {
        playerO.brain(view.playerOBrain())
        resetGame()
    }

    const registerPlayerMove = (arg) => {
        disableClick()
        // checking move, if board is not null, return
        if (gameBoard.board()[arg[0]][arg[1]] !== null) return playerTurn()
        
        // placing move on the board
        const player = gameBoard.players()[gameBoard.turnCount()%2]
        gameBoard.turnCount(gameBoard.turnCount() + 1)
        gameBoard.board()[arg[0]][arg[1]] = player
        view.boardCells(gameBoard.board())

        // find winner
        const winner  = gameBoard.winner(gameBoard.board())
        console.log('winner',winner)
        switch (true) {
            case winner === 'X':
                playerX.score(playerX.score()+1)
                view.notification(`${player} WON THE GAME !`)
                break
            case winner === 'O':
                playerO.score(playerO.score()+1)
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

    const disableClick = () => {
        board.removeEventListener('pointerdown', playerClickHandler)
    }

    const enableClick = () => {
        board.addEventListener('pointerdown', playerClickHandler)
    }
    
    const playerClickHandler = (e) => {
        registerPlayerMove([e.target.dataset.row, e.target.dataset.col])
    }

    const playerTurn = () => {
        const player = gameBoard.players()[gameBoard.turnCount()%2]
        // check brain, if it's human then allow for event listener for click
        switch (true) {
            case player === 'X':
                playerX.brain() === 'human'
                    ? enableClick()
                    : null
                break
            case player === 'O':
                playerO.brain() === 'human'
                    ? enableClick()
                    : null
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
    playerTurn()

    return{
        renderBoard,
    }
})()

// displayController.renderBoard([1,2])

// // const gameBoard = (()=> {
// //     let _players = ['X', 'O']

// //     let _board = [
// //         [null,null,null],
// //         [null,null,null],
// //         [null,null,null]
// //     ]

// //     const boards = (arg) => {
// //         document.querySelectorAll('.cell')
// //     }

// //     let _turnCount = 0
// //     let _currentPlayer = _players[_turnCount]
// //     let _blurToggle = false
// //     let _cellsAngle = 0

// //     // cache DOM
// //     const _boardContainer = document.querySelector('.tictactoe-container')
// //     const _cells = document.querySelectorAll('.cell')
// //     const r = document.querySelector(':root');
    
// //     // methods
// //     const players = () => {
// //         return _players
// //     }

// //     const setPlayers = (arg) => {
// //         _players = arg
// //         _render()
// //         return _players
// //     }

// //     const board = () => {
// //         return _board
// //     }

// //     const setBoard = (arg) => {
// //         _board = arg
// //         _render()
// //         return _board
// //     }

// //     const turnCount = () => {
// //         return _turnCount
// //     }

// //     const setTurnCount = (arg) => {
// //         _turnCount = arg
// //         setCurrentPlayer(_players[_turnCount%2])
// //         _render()
// //         return _turnCount
// //     }
    
// //     const currentPlayer = () => {
// //         return _currentPlayer
// //     }
    
// //     const setCurrentPlayer = (arg) => {
// //         _currentPlayer = arg
// //         _render()
// //         return _currentPlayer
// //     }
    
// //     const cellsAngle = () => {
// //         return _cellsAngle
// //     }

// //     const setCellAngle = (arg) => {
// //         _cellsAngle = arg
// //         r.style.setProperty('--cells-rotate', `${arg}deg`);
// //         return _cellsAngle
// //     }


// //     const _playerTurn = () => {
// //         setCellAngle(_cellsAngle + (playerO.score()-playerX.score()))
// //         const turn = currentPlayer()
// //         switch (true){
// //             case turn === 'X' && playerX.brain() === 'human':
// //                 _enableClick()
// //                 break
// //             case turn === 'O' && playerO.brain() === 'human':
// //                 _enableClick()
// //                 break
// //             case turn === 'X' && playerX.brain() !== 'human':
// //                 setTimeout(()=>{
// //                     registeringPlayerMove(ai.nextMove([_board, playerX.brain(), _currentPlayer]))
// //                 },1000)
// //                 break
// //             case turn === 'O' && playerO.brain() !== 'human':
// //                 setTimeout(()=>{
// //                     registeringPlayerMove(ai.nextMove([_board, playerO.brain(), _currentPlayer]))
// //                 },1000)
// //             break
// //         }
// //     }

//     const _disableClick = () => {
//         _boardContainer.removeEventListener('pointerdown', _clickHandler)
//     }

//     const _enableClick = () => {
//         _boardContainer.addEventListener('pointerdown', _clickHandler)
//     }
    
//     const registeringPlayerMove = (arg) => {
//         if (_turnCount === null) return 
//         const [row, col] = arg
//         if (_board[row][col] !== null) return _playerTurn()
//         const turn = _players[(_turnCount)%2]
//         console.log(`Registering player ${turn} moves at ${arg}`)
//         _board[row][col] = turn
//         setTurnCount(_turnCount + 1)
//         _render()
//         if (_turnCount < 5) return _playerTurn()
//         switch (true) {
//             case ai.checkWinner(_board, turn) === 'win':
//                 notification.setNotif(`${turn} WON THIS ROUND !`)
//                 turn === 'X'
//                     ? playerX.setScore(playerX.score() + 1)
//                     : playerO.setScore(playerO.score() + 1)
//                 _reset()
//                 break
//             case ai.checkWinner(_board, turn) === 'draw':
//                 notification.setNotif('DRAW !')
//                 _reset()
//                 break
//             default:
//                 _playerTurn()
//                 break
//         }
//     }
                    
    
//     const _reset =()=> {
//         setTurnCount(null)
//         blurToggle()
//         _disableClick()
//         setTimeout(()=>{
//             setBoard([
//                 [null,null,null],
//                 [null,null,null],
//                 [null,null,null]
//             ])
//             setTurnCount(0)
//             _playerTurn()
//             blurToggle()
//         },2000)
//     }

//     const _render = () => {
//         _cells.forEach(element => {
//             const [row,col] = [element.dataset.row, element.dataset.col]
//             element.textContent = ''
//             element.classList.remove('font-effect-fire')
//             element.classList.remove('font-effect-fire')
//             switch (true) {
//                 case _board[row][col] === 'X':
//                     element.textContent = 'X'
//                     element.classList.add('font-effect-fire')
//                     break
//                 case _board[row][col] === 'O':
//                     element.textContent = 'O'
//                     element.classList.add('font-effect-neon')
//                     break
//             }
//         })
//     }
    
//     const blurToggle = () => {
//         if (_blurToggle === false) {
//             _blurToggle = true
//             _boardContainer.classList.add('blur')
//         } else {
//             _blurToggle = false
//             _boardContainer.classList.remove('blur')
//         }
//     } 
    
//     const resumeGame = () => {
//         _reset()
//     }

//     // const _populateBoard = (size) => {

//     // }

//     const _clickHandler = (e) => {
//         _disableClick()
//         const [row, col] = [e.target.dataset.row, e.target.dataset.col]
//         registeringPlayerMove([row, col])
//     }

//     // init
//     _render()
//     _playerTurn()

//     return {
//         players,
//         setPlayers,
//         board,
//         setBoard,
//         turnCount,
//         setTurnCount,
//         currentPlayer,
//         setCurrentPlayer,
//         cellsAngle,
//         setCellAngle,
//         resumeGame,
//         registeringPlayerMove,
//         blurToggle,
//     }
// })()

// const notification = (()=> {
//     let _notif = ''
    
//     // cache DOM
//     const notifBoard = document.querySelector('.announcement')
    
//     // methods
//     const notif = () => {
//         return _notif
//     }

//     const setNotif = (arg)=> {
//         _notif = arg
//         _render()
//     }
    
//     const _render =()=> {
//         notifBoard.textContent = _notif
//         setTimeout(()=>{
//             notifBoard.textContent = ''
//         },3000)
//     }
    
//     // bind events
//     // init
//     return {
//         notif,
//         setNotif,
//     }
// })()

// const settings = (() => {
//     // cache dom
//     const brainSelection = document.querySelectorAll('.settings > * > select')

//     // events handler
//     const brainHandler = (e) => {
//         const [player] = e.target.id.match(/(?<=[-])[ox](?=[-])/g)
//         const brain = e.target.value
//         switch (true) {
//             case player === 'x':
//                 pubSub
//                 playerX.setBrain(brain)
//                 gameBoard.resumeGame()
//                 break
//             case player === 'o':
//                 playerO.setBrain(brain)
//                 gameBoard.resumeGame()
//                 break
//         }
//     }

//     // bind events
//     brainSelection.forEach(element=> {
//         element.addEventListener('change', brainHandler)
//     })

//     // init
//     return {
//     }
// })()
