import { useEffect, useState } from 'react'
import './App.css'
import PlayRandomMoveEngine from './components/PlayRandomMoveEngine.jsx';

const initialLinesOk = { 1: { checked: false, good: false }, 2: { checked: false, good: false }, 3: { checked: false, good: false } };
const initialCounters = { goodMoves: 0, badMoves: 0 };

const levelFen = {
  1: {
    fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3',
    validMoves: {
      1: { move: 'Bc5', response: 'c3' },
      2: { move: 'Nf6', response: 'd3' },
      3: { move: 'Be7', response: 'd4' }
    },
  },
  2: {
    fen: 'r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/2P2N2/PP1P1PPP/RNBQK2R b KQkq - 0 4',
    validMoves: {
      1: { move: 'Nf6', response: 'd4' },
      2: { move: 'Qe7', response: 'd4' },
      3: { move: 'd6', response: 'd4' }
    },

  },
  3: {
    fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2BPP3/2P2N2/PP3PPP/RNBQK2R b KQkq d3 0 5',
    validMoves: {
      1: { move: 'exd4', response: 'e5' },
      2: { move: 'Bb6', response: 'Nxe5' },
      3: { move: 'Bd6', response: 'O-O' }
    },

  },
  4: {
    fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1P3/2Bp4/2P2N2/PP3PPP/RNBQK2R b KQkq - 0 6',
    validMoves: {
      1: { move: 'd5', response: 'Be2' },
      2: { move: 'Ne4', response: 'Bd5' },
      3: { move: 'Ng4', response: 'cxd4' }
    },

  },
  5: {
    fen: 'r1bqk2r/ppp2ppp/2n2n2/2bpP3/3p4/2P2N2/PP2BPPP/RNBQK2R b KQkq - 1 7',
    validMoves: {
      1: { move: 'Ne4', response: 'cxd4' },
      2: { move: 'd3', response: 'exf6' },
      3: { move: 'Ng8', response: 'cxd4' }
    },

  },
  6: {
    fen: 'r1bqk2r/ppp2ppp/2n5/2bpP3/3Pn3/5N2/PP2BPPP/RNBQK2R b KQkq - 0 8',
    validMoves: {
      1: { move: 'Bb6', response: 'O-O' },
      2: { move: 'Bb4', response: 'Bd2' },
      3: { move: 'Be7', response: 'O-O' }
    },
  },
  7: {
    fen: 'r1bqk2r/ppp2ppp/1bn5/3pP3/3Pn3/5N2/PP2BPPP/RNBQ1RK1 b kq - 2 9',
    validMoves: {
      1: { move: 'O-O', response: 'Nc3' },
      2: { move: 'Bf5', response: 'Be3' },
      3: { move: 'f6', response: 'Nc3' }
    },
  }
}

function App() {
  const [fen, setFen] = useState('');
  const [validMoves, setValidMoves] = useState(null);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [error, setError] = useState('');
  const [moveMessage, setMoveMessage] = useState('');
  const [triggerLineMove, setTriggerLineMove] = useState(null);
  const [linesOk, setLinesOk] = useState(initialLinesOk);
  const [currentLine, setCurrentLine] = useState(0);
  const [counters, setCounters] = useState(initialCounters);

  const [showOppeningsTable, setShowOppeningsTable] = useState(true);
  const [centeredTextTop, setCenteredTextTop] = useState('Click "Next Variation" to see black’s most common move');
  const [centeredTextBot, setCenteredTextBot] = useState('');
  const [validationButtonText, setValidationButtonText] = useState('Next Variation');
  const [validationDisable, setValidationDisable] = useState(false);


  const [lastMove, setLastMove] = useState('');


  // const [currentTurn, setCurrentTurn] = useState('')
  // const [levelLinesMoves, setLevelLinesMoves] = useState('')


  // makes that the one who is currently playing make the move first
  // useEffect(() => {
  //   const firstFen = levelFen[currentLevel + 1].fen
  //   setLevelLinesMoves(firstFen.split(' ')[1])
  // },[currentLevel])

  // useEffect(() => {
  //   if(fen != ''){
  //     const orientation = fen.split(' ')[1];
  //     setCurrentTurn(orientation);
  //   }
  // },[fen])


  useEffect(() => {
    if (moveMessage === 'OK') {
      setCounters({ ...counters, goodMoves: counters.goodMoves + 1 });
      const updatedLinesOk = { ...linesOk };
      for (const key in updatedLinesOk) {
        if (updatedLinesOk.hasOwnProperty(key)) {
          if (updatedLinesOk[key].checked === true) {
            updatedLinesOk[key] = { ...updatedLinesOk[key], checked: true, good: levelFen[currentLevel].validMoves[key].response };
          }
        }
      }
      setLinesOk(updatedLinesOk);
      setCenteredTextTop("Congratulations! The move is CORRECT!")
      setValidationDisable(false)


    } else if (moveMessage === 'NO') {
      setCounters({ ...counters, badMoves: counters.badMoves + 1 });
      setCenteredTextTop("It's not the best move in this position!")
      setCenteredTextBot('Try Again');
      setValidationButtonText('Try Again');
      setValidationButtonText('Next Variation')
      setValidationDisable(false);

    }
  }, [moveMessage]);


  const chargeGame = (gameName) => {
    let validMove = '';
    switch (gameName) {
      case 'italian':
        if (validMoves == null && !linesOk[1].good
          // && levelLinesMoves == currentTurn
        ) {
          setCurrentLevel(1)
          setTriggerLineMove({ move: null, fen: levelFen[1].fen })
          validMove = levelFen[1].validMoves[1].response

        }
        break;
      default:
        break;
    }

    setTimeout(() => {
      setValidMoves(validMove)
    }, 500)
    setShowOppeningsTable(false)


  }



  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '95vh', justifyContent: 'space-evenly' }} >
      <h3>LEVEL: {currentLevel}</h3>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-around' }}> <div><span style={{ color: 'green' }}>CORRECT MOVES</span> : {counters.goodMoves} </div>  <div><span style={{ color: 'red' }}>WRONG MOVES</span> : {counters.badMoves}</div></div>

      {/* {validMoves ? <span> ValidMove: {JSON.stringify(validMoves)} </span> : ''} */}

      {showOppeningsTable ?
        <table>
          <thead>
            <tr>
              <th>WHITE PIECES</th>
              <th>BLACK PIECES</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><button onClick={() => chargeGame("italian")}>Italian Game</button></td>
              <td><button>Sicilian Defense</button></td>
            </tr>
            <tr>
              <td><button>Ruy-Lopez</button></td>
              <td><button>French Defense</button></td>
            </tr>
            <tr>
              <td><button>Scotch Game</button></td>
              <td><button>Caro-Kann</button></td>
            </tr>
          </tbody>

        </table> :

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }} >
          <p>{centeredTextTop}</p>

          {/* validation button */}
          <button disabled={validationDisable} onClick={() => {
            if (validationButtonText == 'Next Variation') {
              let line = 0;
              const updatedLinesOk = { ...linesOk };
              for (const key in updatedLinesOk) {
                if (updatedLinesOk.hasOwnProperty(key)) {
                  if (updatedLinesOk[key].checked === false) {
                    updatedLinesOk[key] = { ...updatedLinesOk[key], checked: true, good: false };
                    setValidationDisable(true);
                    line = key;
                    break;
                  }
                }
              }
              if (line > 0) {
                setTriggerLineMove({ move: levelFen[currentLevel].validMoves[line].move, fen: levelFen[currentLevel].fen })
              }
              setLinesOk(updatedLinesOk);
              setCenteredTextTop('This is one of the most common moves that black plays in this position.')
            }



          }}>{validationButtonText}</button>

          <div className='variationsBoxes'>
            <div>
              {linesOk[1].checked ?
                <>
                  <span>Black’s move: {levelFen[currentLevel].validMoves[1].move}</span>
                  <span>White’s move: {lastMove == levelFen[currentLevel].validMoves[1].response ? initialLinesOk[1].good : '?'} </span>
                  <span>Result: {initialLinesOk[1].checked  != '' ? 'CORRECT' : 'WRONG' }</span>
                </> : ''}
            </div>

            <div>
              {linesOk[2].checked ?
                <>
                  <span>Black’s move:  {levelFen[currentLevel].validMoves[2].move}</span>
                  <span>White’s move: ?</span>
                  <span>Result:</span>
                </> : ''}
            </div>

            <div>
              {linesOk[3].checked ?
                <>
                  <span>Black’s move:  {levelFen[currentLevel].validMoves[3].move}</span>
                  <span>White’s move: ?</span>
                  <span>Result:</span>
                </> : ''}
            </div>
          </div>
          {centeredTextBot}

        </div>
      }

      <div className='gameContainer' style={{ width: '35%', minWidth: '375px' }}>
        <PlayRandomMoveEngine fen={fen} setFen={setFen} setLastMove={setLastMove} setError={setError} validMoves={validMoves} setValidMoves={setValidMoves} setMoveMessage={setMoveMessage} triggerLineMove={triggerLineMove} />
      </div>


      {error != '' ? <span style={{ position: 'absolute', top: '4%', color: 'red', backgroundColor: 'pink', borderRadius: '5px', padding: '2px', fontSize: '1.5rem' }}>{error}</span> : ''}


    </div>
  )
}

export default App
