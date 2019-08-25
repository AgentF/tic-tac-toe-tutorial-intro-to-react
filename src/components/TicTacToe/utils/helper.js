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

  let output = { winner: '', positions: [] };
  lines.forEach(([[a, b], [c, d], [e, f]]) => {
    if (
      squares[a][b].value &&
      squares[a][b].value === squares[c][d].value &&
      squares[a][b].value === squares[e][f].value
    )
      output = {
        winner: squares[a][b].value,
        positions: [[a, b], [c, d], [e, f]],
      };
  });
  return output;
}

export default calculateWinner;
