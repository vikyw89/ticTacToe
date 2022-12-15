# ticTacToe

Live Preview : https://vikyw89.github.io/ticTacToe/

Made by Viky for The Odin Project 2022

changelog:

20221215
fixed bugs of error when there are multiple fast clicks
prevent highlights of text and element on the game
fixed bugs when changing mode
reworked the AI priorities
These AI will analyze 1 step based on different strategy combination
easy => random moves
normal => aim for winning ?? easyAI
hard = > aim for winning ?? prevent enemy from winning ?? easyAI

<ol>
  <li>Set up your project with HTML, CSS and Javascript files and get the Git repo all set up.</li>
  <li>You’re going to store the gameboard as an array inside of a Gameboard object, so start there!  Your players are also going to be stored in objects… and you’re probably going to want an object to control the flow of the game itself.
<ol>
  <li>Your main goal here is to have as little global code as possible.  Try tucking everything away inside of a module or factory.  Rule of thumb: if you only ever need ONE of something (gameBoard, displayController), use a module.  If you need multiples of something (players!), create them with factories.</li>
</ol>
  </li>
  <li>Set up your HTML and write a JavaScript function that will render the contents of the gameboard array to the webpage (for now you can just manually fill in the array with <code>"X"</code>s and <code>"O"</code>s)</li>
      <li>Build the functions that allow players to add marks to a specific spot on the board, and then tie it to the DOM, letting players click on the gameboard to place their marker. Don’t forget the logic that keeps players from playing in spots that are already taken!
        <ol>
          <li>Think carefully about where each bit of logic should reside. Each little piece of functionality should be able to fit in the game, player or gameboard objects.. but take care to put them in “logical” places.  Spending a little time brainstorming here can make your life much easier later!</li>
        </ol>
      </li>
      <li>Build the logic that checks for when the game is over!  Should check for 3-in-a-row and a tie.</li>
      <li>Clean up the interface to allow players to put in their names, include a button to start/restart the game and add a display element that congratulates the winning player!</li>
      <li>Optional - If you’re feeling ambitious create an AI so that a player can play against the computer!
        <ol>
          <li>Start by just getting the computer to make a random legal move.</li>
          <li>Once you’ve gotten that, work on making the computer smart.  It is possible to create an unbeatable AI using the minimax algorithm (read about it <a href="https://en.wikipedia.org/wiki/Minimax" target="_blank" rel="noopener noreferrer">here</a>, some googling will help you out with this one)</li>
      <li>If you get this running <em>definitely</em> come show it off in the chatroom.  It’s quite an accomplishment!</li>
    </ol>
  </li>
</ol>
