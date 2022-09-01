import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

// class Square extends React.Component {
//   render() {
//     return (
//       <button
//         className="square"
//         onClick={() => {
//           // console.log('click')
//           this.props.onClick()
//         }}
//       >
//         {this.props.value}
//       </button>
//     )
//   }
// }

function Square(props) {
  return (
    <button className="square" style={props.highlight ? { color: 'red' } : {}} onClick={props.onClick}>
      {props.value}
    </button>
  )
}

class Board extends React.Component {
  renderSquare(i, highlight) {
    return <Square value={this.props.squares[i]} highlight={highlight} key={i} onClick={() => this.props.onClick(i)} />
  }

  render() {
    const squares = []
    for (let i = 0; i < 3; i++) {
      const row = []
      for (let j = 0; j < 3; j++) {
        row.push(this.renderSquare(i * 3 + j, this.props.highlightList.includes(i * 3 + j)))
      }
      squares.push(<div key={i}>{row}</div>)
    }
    return <div>{squares}</div>
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          row: -1,
          col: -1,
        },
      ],
      reverse: false,
      stepNumber: 0,
      xIsNext: true,
    }
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length - 1]
    const squares = current.squares.slice()
    if (calculateWinner(squares).winner || squares[i]) {
      return
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O'
    const row = ((i / 3) | 0) + 1
    const col = (i % 3) + 1
    this.setState({
      history: history.concat([{ squares, row, col }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    })
  }
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    })
  }
  reverseHistory() {
    this.setState({
      reverse: !this.state.reverse,
    })
  }
  render() {
    const history = this.state.history
    const current = history[this.state.stepNumber]
    const { winner, line } = calculateWinner(current.squares)

    const moves = (this.state.reverse ? history.slice().reverse() : history).map((step, move) => {
      let desc
      move = this.state.reverse ? history.length - 1 - move : move
      if (move === 0) {
        desc = 'Go to game start'
      } else {
        desc = `Go to move # ${this.state.xIsNext ? 'X' : 'Y'} (row: ${step.row}, col: ${step.col})`
      }

      return (
        <li key={move}>
          <button style={this.state.stepNumber === move ? { fontWeight: 800 } : {}} onClick={() => this.jumpTo(move)}>
            {desc}
          </button>
        </li>
      )
    })

    let status
    if (winner) {
      status = 'Winner: ' + winner
    } else if (this.state.stepNumber === 9) {
      status = 'It ends in a draw'
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O')
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} highlightList={line} onClick={(i) => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.reverseHistory()}>反转历史记录</button>
          <ol>{moves}</ol>
        </div>
      </div>
    )
  }
}

// @ts-ignore
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<Game />)

// 计算胜者，8种胜利方式
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
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: lines[i] }
    }
  }
  return { winner: null, line: [] }
}
