import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const Square = (props) => {
  return (
    <button className={`square ${props.hightlighted ? 'winnig' : ''}`}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

const Board = (props) => {
  return (
    props.squares.map((row, i) =>
      <div className="board-row" key={`row-${i}`}>
        {row.map((square, j) =>
          <Square
            hightlighted={props.positions ? props.positions.findIndex(([a, b]) => a === i && b === j) !== -1 : false}
            key={`square-${i}-${j}`}
            value={square}
            onClick={() => props.onClick(i, j)}
          />
        )}
      </div>
    )
  );
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(3).fill(Array(3).fill(null)),
        },
      ],
      xIsNext: true,
      stepNumber: 0,
      movesOrderIsDescending: true,
    }
  }

  handleClick(i, j) {
    const {
      xIsNext,
      stepNumber,
    } = this.state;

    const history = this.state.history.slice(0, stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.map(row => [...row]);
    const { winner } = calculateWinner(squares);
    if (winner || squares[i][j])
      return;
    squares[i][j] = xIsNext ? 'X' : 'O';
    this.setState({
      history: [...history, { squares: [...squares], lastMove: [i, j] }],
      xIsNext: !xIsNext,
      stepNumber: history.length,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const {
      history,
      xIsNext,
      stepNumber,
      movesOrderIsDescending,
    } = this.state;

    const current = history[stepNumber];
    const squares = [...current.squares];
    const { winner, positions } = calculateWinner(squares);
    let status = `Next player: ${xIsNext ? 'X' : 'O'}`;
    if (winner)
      status = `The Winner is: ${winner}`;
    else if (squares.every(row => row.every(square => square)))
      status = 'Draw!';

    const moves = history.map(({ lastMove }, move) =>
      <li key={move}>
        <button onClick={() => this.jumpTo(move)}>
          {move ?
            `Go to move #${move} (${lastMove[0] + 1}, ${lastMove[1] + 1})`
            : 'Go to game start'
          }
        </button>
      </li>
    );

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={squares}
            positions={winner ? positions : false}
            onClick={(i, j) => this.handleClick(i, j)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.setState({ movesOrderIsDescending: !movesOrderIsDescending })}>
            {movesOrderIsDescending ? '🡅' : '🡇'}
          </button>
          <ol>
            {movesOrderIsDescending ?
              moves
              : [...moves].reverse()
            }
          </ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [[0, 0], [0, 1], [0, 2]],
    [[1, 0], [1, 1], [1, 2]],
    [[2, 0], [2, 1], [2, 2]],
    [[0, 0], [1, 0], [2, 0]],
    [[0, 1], [1, 1], [2, 1]],
    [[0, 2], [1, 2], [2, 2]],
    [[0, 0], [1, 1], [2, 2]],
    [[0, 2], [1, 1], [2, 0]],
  ];

  let output = { winner: null, positions: [] };
  lines.forEach(([[a, b], [c, d], [e, f]]) => {
    if (squares[a][b] && squares[a][b] === squares[c][d] && squares[a][b] === squares[e][f])
      output = { winner: squares[a][b], positions: [[a, b], [c, d], [e, f]] };
  })
  return output;
}