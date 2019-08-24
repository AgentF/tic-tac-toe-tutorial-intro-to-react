/* eslint-disable react/no-array-index-key */
import React from 'react';
import Board from './Board';
import Info from './Info';
import calculateWinner from './utils/helper';

const initialState = {
  history: [
    {
      squares: Array(3).fill(Array(3).fill({ value: '' })),
    },
  ],
  xIsNext: Math.random() < 0.5,
  stepNumber: 0,
  isReplaying: false,
  autoReplayed: false,
};

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;

    this.handleReplay = this.handleReplay.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleJumpTo = this.handleJumpTo.bind(this);
  }

  componentDidUpdate() {
    const { history, stepNumber } = this.state;

    const current = history[stepNumber];
    const squares = [...current.squares];
    const { positions } = calculateWinner(squares);
    if (positions)
      positions.forEach(([a, b]) =>
        document.querySelector(`#square-${a}-${b}`).classList.add('winning'),
      );
  }

  handleReplay(recursion = 'initial') {
    const { history } = this.state;
    const step = recursion === 'initial' ? 0 : recursion;
    const nextStep = step + 1;
    if (nextStep === history.length) {
      this.setState({
        stepNumber: step,
        xIsNext: step % 2 === 0,
        isReplaying: false,
        autoReplayed: true,
      });
    } else {
      this.setState(
        {
          stepNumber: step,
          xIsNext: step % 2 === 0,
          isReplaying: true,
        },
        () => {
          if (nextStep < history.length) {
            setTimeout(() => {
              this.handleReplay(nextStep);
            }, 500);
          }
        },
      );
    }
  }

  handleReset() {
    this.setState(initialState);
  }

  handleSquareClick(i, j) {
    const { xIsNext, isReplaying, stepNumber, history } = this.state;

    if (isReplaying) return;

    const historyChanged = history.slice(0, stepNumber + 1);
    const current = historyChanged[historyChanged.length - 1];
    const squares = [
      ...current.squares.map(row => row.map(square => ({ ...square }))),
    ];
    const { winner: alreadyWon } = calculateWinner(squares);

    if (alreadyWon || squares[i][j].value) return;

    squares[i][j].value = xIsNext ? 'X' : 'O';
    this.setState({
      history: [...historyChanged, { squares, lastMove: [i, j] }],
      xIsNext: !xIsNext,
      stepNumber: historyChanged.length,
    });
  }

  handleJumpTo(step, lastMove) {
    const { history, isReplaying } = this.state;

    if (isReplaying) return;

    if (lastMove) {
      const [a, b] = lastMove;
      const current = history[step];
      const squares = [
        ...current.squares.map(row => row.map(square => ({ ...square }))),
      ];

      this.setState(
        {
          history: [
            ...history.slice(0, step),
            { squares, lastMove },
            ...history.slice(step + 1),
          ],
          stepNumber: step,
          xIsNext: step % 2 === 0,
        },
        () => {
          const square = document.querySelector(`#square-${a}-${b}`);
          square.addEventListener('animationend', () =>
            square.classList.remove('selected'),
          );
          square.classList.add('selected');
        },
      );
    } else {
      this.setState({
        stepNumber: step,
        xIsNext: step % 2 === 0,
      });
    }
  }

  render() {
    const {
      history,
      xIsNext,
      isReplaying,
      stepNumber,
      autoReplayed,
    } = this.state;

    const current = history[stepNumber];
    const squares = [...current.squares];
    const { winner } = calculateWinner(squares);

    let status = `Next player: ${xIsNext ? 'X' : 'O'}`;
    if (winner) {
      status = `The Winner is: ${winner}`;
      if (!autoReplayed) setTimeout(() => this.handleReplay(), 500);
    } else if (squares.every(row => row.every(({ value }) => value)))
      status = 'Draw!';

    return (
      <div className="game">
        <Board
          squares={squares}
          handleSquareClick={(i, j) => this.handleSquareClick(i, j)}
        />
        <Info
          status={status}
          isReplaying={isReplaying}
          squares={squares}
          history={history}
          handleReplay={this.handleReplay}
          handleReset={this.handleReset}
          handleJumpTo={this.handleJumpTo}
        />
      </div>
    );
  }
}

export default Game;
