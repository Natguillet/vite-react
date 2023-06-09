import { useState } from 'react'
import './App.css'

function Square({value, onSquareClick, isWin}) {
  return <button className="square" onClick={onSquareClick} style={isWin ? {backgroundColor: "green"} : {color: ""}}>{value}</button>
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if(calculateWinner(squares) || squares[i]) return;

    const nextSquares = squares.slice();

    if(xIsNext) {
      nextSquares[i]="X";
    } else {
      nextSquares[i]="O";
    }
    onPlay(nextSquares, i);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner.sign;
  } else if (squares.every(square => square != null)) {
    status = "Draw !";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  let displayArray = Array(3);
  for (let index = 0; index < 3; index++) {
    displayArray[index] = [squares[index * 3], squares[index * 3 + 1], squares[index * 3 + 2]];
  }

  return (
    <>
      <div className="status">{status}</div>
      {
        displayArray.map((item, index) => (
          <div className="board-row">
            {item.map((square, i) => (
              <Square value={squares[i + index * 3]} onSquareClick={() => handleClick(i + index * 3)} isWin={winner && winner.lines.includes(i + index * 3)}/>
            ))}
          </div>
        ))
      }
    </>
  ) ;
}

export default function Game() {
  const [history, setHystory] = useState([Array(9).fill(null)]);
  const [historyMove, setHystoryMove] = useState(Array(9).fill(null));
  const [currentMove, setCurrentMove] = useState(0);
  const [toggle, setToggle] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares, index) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    historyMove.splice(currentMove, historyMove.length - currentMove + 1, null);
    historyMove[currentMove] = index;
    console.log(historyMove);
    setHystoryMove(historyMove);
    setHystory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    
    let moveIndex;
    if(toggle) {
      moveIndex = history.length - move - 1;
    } else {
      moveIndex = move;
    }

    let description;
    if (moveIndex > 0) {
      description = 'Go to move #' + moveIndex;
    } else {
      description = 'Go to game start';
    }

    let coord;
    if(historyMove[moveIndex] != null) {
      let x = Math.floor(historyMove[moveIndex] / 3) + 1;
      let y = historyMove[moveIndex] % 3 + 1;
      coord = " (" + y + "," + x + ")";
    }

    let moveDescription;
    if (moveIndex === currentMove) {
      moveDescription = <p>You are at move #{currentMove}</p>
    } else {
      moveDescription = <button onClick={() => jumpTo(moveIndex)}>{description}{coord}</button>
    }

    return (
      <li key={moveIndex}>
        {moveDescription}
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
      </div>
      <div className="game-info">
        <button onClick={() => setToggle(!toggle)}>Change order</button>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for(let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {sign: squares[a], lines: [a, b, c]};
    }
  }
  return null;
}
