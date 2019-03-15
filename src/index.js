import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const Square = (props) => {
  return (
    <button className="square"
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {

  renderSquare(i) {
    const {
      squares,
    } = this.props;
    return (
      <Square value={squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      xIsNext: true,
      stepNumber: 0,
    }
  }

  handleClick(i) {
    const {
      xIsNext,
      stepNumber,
    } = this.state;

    const history = this.state.history.slice(0, stepNumber + 1);
    const current = history[history.length - 1];
    const squares = [...current.squares];
    const possibleWinner = calculateWinner(squares);
    if (possibleWinner || squares[i]) {
      return;
    }
    squares[i] = xIsNext ? 'X' : 'O';
    this.setState({
      history: [...history, { squares }],
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
    } = this.state;

    const current = history[stepNumber];
    const squares = [...current.squares];
    const possibleWinner = calculateWinner(squares);
    // const status = possibleWinner ? `The Winner is: ${possibleWinner}` : `Next player: ${xIsNext ? 'X' : 'O'}`;
    let status = `Next player: ${xIsNext ? 'X' : 'O'}`;
    if (possibleWinner)
      status = `The Winner is: ${possibleWinner}`;
    else if (squares.every(move => move))
      status = 'Tie!';

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
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
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  let output = null;
  lines.forEach(([a, b, c]) => {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
      output = squares[a];
  })
  return output;
}