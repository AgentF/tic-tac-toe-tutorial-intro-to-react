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
  someoneWon: '',
};

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;

    this.handleReplay = this.handleReplay.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleJumpTo = this.handleJumpTo.bind(this);
  }

  /*
    @param  {string}  recursion  Square id ej: square-0-0.
  */
  handleReplay(step = 0) {
    const { history } = this.state;
    const nextStep = step + 1;
    if (nextStep === history.length) {
      const current = history[history.length - 1];
      const squares = [
        ...current.squares.map(row => row.map(square => ({ ...square }))),
      ];
      const { winner: someoneWon, positions } = calculateWinner(squares);
      positions.forEach(([x, y]) => {
        history[history.length - 1].squares[x][y].status = 2;
      });
      this.setState({
        stepNumber: step,
        xIsNext: step % 2 === 0,
        isReplaying: false,
        autoReplayed: true,
        someoneWon,
      });
    } else {
      this.setState(
        {
          stepNumber: step,
          xIsNext: step % 2 === 0,
          isReplaying: true,
          someoneWon: '',
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
    const {
      xIsNext,
      isReplaying,
      stepNumber,
      history,
      someoneWon,
    } = this.state;

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

    if (someoneWon || squares[a][b].value !== '') return;

    squares[a][b].value = xIsNext ? 'X' : 'O';
    const { winner, positions } = calculateWinner(squares);
    positions.forEach(([x, y]) => {
      history[history.length - 1].squares[x][y].status = 2;
    });

    this.setState({
      history: [...historyChanged, { squares, lastMove: [a, b] }],
      xIsNext: !xIsNext,
      stepNumber: historyChanged.length,
      someoneWon: winner,
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
      const historySelected = [...history];
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
      someoneWon,
    } = this.state;

    const current = history[stepNumber];
    const squares = [...current.squares];

    let status = `Next player: ${xIsNext ? 'X' : 'O'}`;
    if (someoneWon !== '') {
      status = `The Winner is: ${someoneWon}`;
      if (!autoReplayed) setTimeout(() => this.handleReplay(), 1000);
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
          stepNumber={stepNumber}
          handleReplay={() => this.handleReplay()}
          handleReset={() => this.handleReset()}
          handleJumpTo={(step, lastMove) => this.handleJumpTo(step, lastMove)}
        />
      </div>
    );
  }
}

export default Game;
