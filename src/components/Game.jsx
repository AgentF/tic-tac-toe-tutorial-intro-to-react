import React from 'react';
import Board from './Board';
import { calculateWinner } from '../helpers/helpers';
import './Game.css';

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(3).fill(Array(3).fill({ value: null })),
        },
      ],
      xIsNext: Math.random() < 0.5,
      stepNumber: 0,
      movesOrderIsDescending: true,
      replaying: false,
      autoReplayed: false,
    };

    this.replay = this.replay.bind(this);
  }

  componentDidUpdate() {
    const {
      history,
      stepNumber,
    } = this.state;

    const current = history[stepNumber];
    const squares = [...current.squares];
    const { positions } = calculateWinner(squares);
    if (positions)
      positions.forEach(([a, b]) => document.querySelector(`#square-${a}-${b}`).classList.add('winning'))
  }

  replay(recursion = 'initial') {
    const {
      history,
    } = this.state;
    const step = recursion === 'initial' ? 0 : recursion;
    const nextStep = step + 1;
    if (nextStep === history.length) {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
        replaying: false,
        autoReplayed: true,
      })
    } else {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
        replaying: true,
      }, () => {
        if (nextStep < history.length) {
          setTimeout(() => {
            this.replay(nextStep);
          }, 500);
        }
      });

    }
  }

  handleClick(i, j) {
    const {
      xIsNext,
      replaying,
      stepNumber,
    } = this.state;

    if(replaying)
      return;

    const history = this.state.history.slice(0, stepNumber + 1);
    const current = history[history.length - 1];
    const squares = [...current.squares.map(row => row.map(square => ({ ...square })))];
    const { winner: alreadyWon } = calculateWinner(squares);

    if (alreadyWon || squares[i][j].value)
      return;

    squares[i][j].value = xIsNext ? 'X' : 'O';
    this.setState({
      history: [
        ...history,
        { squares, lastMove: [i, j] }
      ],
      xIsNext: !xIsNext,
      stepNumber: history.length,
    });
  }


  jumpTo(step, lastMove) {
    const {
      history,
      replaying,
    } = this.state;
    
    if(replaying)
      return;

    if (lastMove) {
      const [a, b] = lastMove;
      const current = history[step];
      const squares = [...current.squares.map(row => row.map(square => ({ ...square })))];

      this.setState({
        history: [
          ...history.slice(0, step),
          { squares, lastMove },
          ...history.slice(step + 1),
        ],
        stepNumber: step,
        xIsNext: (step % 2) === 0,
      }, () => {
        const square = document.querySelector(`#square-${a}-${b}`);
        square.addEventListener('animationend', () => square.classList.remove('selected'));
        square.classList.add('selected');
      });
    } else {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
      });

    }
  }

  render() {
    const {
      history,
      xIsNext,
      replaying,
      stepNumber,
      autoReplayed,
      movesOrderIsDescending,
    } = this.state;

    const current = history[stepNumber];
    const squares = [...current.squares];
    const { winner } = calculateWinner(squares);
    let status = `Next player: ${xIsNext ? 'X' : 'O'}`;
    if (winner) {
      status = `The Winner is: ${winner}`;
      if (!autoReplayed)
        setTimeout(() => this.replay(), 500);
    }
    else if (squares.every(row => row.every(({ value }) => value)))
      status = 'Draw!';

    const moves = history.map(({ lastMove }, move) =>
      <li key={move}>
        <button className="last-move-button"
          onClick={() => this.jumpTo(move, lastMove)}
        >
          {move ?
            `Go to move #${move} ${lastMove ? `(${lastMove[0] + 1}, ${lastMove[1] + 1})` : ''}`
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
            onClick={(i, j) => this.handleClick(i, j)}
          />
        </div>
        <div className="game-info">
          <div className="status">{status}</div>
          <div className="options-buttons">
            <button className="option-button"
              onClick={() => this.setState({ movesOrderIsDescending: !movesOrderIsDescending })}
            >
              {movesOrderIsDescending ? '🡅' : '🡇'}
            </button>
            <button className="option-button"
              onClick={() => {
                if (!replaying)
                  this.replay();
              }}
              style={{ fontSize: '18px' }}
            >
              <div style={{ animation: replaying ? '1s spin infinite linear' : 'none' }}>⥁</div>
            </button>
          </div>
          <ol className="last-moves">
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

export default Game;