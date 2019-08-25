import React from 'react';
import Board from './Board';
import Info from './Info';
import calculateWinner from './utils/helper';

const initialState = {
  history: [
    {
      squares: [
        [
          {
            id: 'square-0-0',
            value: '',
            status: 0,
          },
          {
            id: 'square-0-1',
            value: '',
            status: 0,
          },
          {
            id: 'square-0-2',
            value: '',
            status: 0,
          },
        ],
        [
          {
            id: 'square-1-0',
            value: '',
            status: 0,
          },
          {
            id: 'square-1-1',
            value: '',
            status: 0,
          },
          {
            id: 'square-1-2',
            value: '',
            status: 0,
          },
        ],
        [
          {
            id: 'square-2-0',
            value: '',
            status: 0,
          },
          {
            id: 'square-2-1',
            value: '',
            status: 0,
          },
          {
            id: 'square-2-2',
            value: '',
            status: 0,
          },
        ],
      ],
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
    const historyWinners = history.slice();

    if (positions)
      positions.forEach(([a, b]) => {
        historyWinners[historyWinners.length - 1].squares[a][b].status = 2;
      });
  }

  /*
    @param  {string}  recursion  Square id ej: square-0-0.
  */
  handleReplay(step = 0) {
    const { history } = this.state;
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

  /*
    @param  {string}  id  Square id ej: square-0-0.
  */
  handleSquareClick(id) {
    const { xIsNext, isReplaying, stepNumber, history } = this.state;

    if (isReplaying) return;

    const [a, b] = id
      .substring(id.length - 3)
      .split('-')
      .map(index => parseInt(index, 10));
    const historyChanged = history.slice(0, stepNumber + 1);
    const current = historyChanged[historyChanged.length - 1];
    const squares = [
      ...current.squares.map(row => row.map(square => ({ ...square }))),
    ];
    const { winner: alreadyWon } = calculateWinner(squares);

    if (alreadyWon || squares[a][b].value !== '') return;

    squares[a][b].value = xIsNext ? 'X' : 'O';
    this.setState({
      history: [...historyChanged, { squares, lastMove: [a, b] }],
      xIsNext: !xIsNext,
      stepNumber: historyChanged.length,
    });
  }

  /*
    @param  {number}  step      Number of the step to go.  ej: 0.
    @param  {array}   lastMove  Last move coordinates.     ej: [0, 0].
  */
  handleJumpTo(step, lastMove) {
    const { history, isReplaying } = this.state;

    if (isReplaying) return;

    if (lastMove) {
      const [a, b] = lastMove;
      const historySelected = history.slice();
      historySelected[step].squares[a][b].status = 3;
      const current = historySelected[step];
      const squares = [
        ...current.squares.map(row => row.map(square => ({ ...square }))),
      ];

      this.setState({
        history: [
          ...historySelected.slice(0, step),
          { squares, lastMove },
          ...historySelected.slice(step + 1),
        ],
        stepNumber: step,
        xIsNext: step % 2 === 0,
      });
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
          handleSquareClick={id => this.handleSquareClick(id)}
        />
        <Info
          status={status}
          isReplaying={isReplaying}
          squares={squares}
          history={history}
          handleReplay={() => this.handleReplay()}
          handleReset={() => this.handleReset()}
          handleJumpTo={(step, lastMove) => this.handleJumpTo(step, lastMove)}
        />
      </div>
    );
  }
}

export default Game;
