const gameBoard = (()=> {
    let gameStats = [
        [null,null,null],
        [null,null,null],
        [null,null,null]
    ]
    let history = []
    
    // cache dom
    const board = document.querySelector('.tictactoe-container')
    
    // bind events
    board.addEventListener('click', boardClickHandler)

    render()

    // methods
    function render() {
        board.innerHTML = ''
        let tempBoard = document.createElement('div')
        for(let y = 0; y < gameStats.length; y++){
            for (let x = 0; x < gameStats[y].length; x++){
                const newCell = document.createElement('div')
                newCell.setAttribute('data-x', x)
                newCell.setAttribute('data-y', y)
                newCell.textContent = gameStats[y][x]
                board.appendChild(newCell)
            }
        }
    }

    function boardClickHandler(e) {
        const playerTurn = history[history.length-1] === 'X'
            ? 'O'
            : 'X'
        history.push(playerTurn)
        console.log(playerTurn)
        console.log(e.target.dataset.x)
        gameStats[e.target.dataset.y][e.target.dataset.x] = playerTurn
        render()
    }

    return {
        playerMove: boardClickHandler
    }
})()

// const player = (name)=> {
//     const name = name
//     let score = 0
//     const win = () => {
//         score++
//     }

//     return {
//         score,
//         win
//     }
// }

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