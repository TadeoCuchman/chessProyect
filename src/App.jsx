import { useEffect, useState } from 'react'
import './App.css'
import PlayRandomMoveEngine from './components/PlayRandomMoveEngine.jsx';

const initialLinesOk = { line1: { checked: false }, line2: { checked: false }, line3: { checked: false } };
const initialCounters = { goodMoves: 0, badMoves: 0 };

function App() {
  const [fen, setFen] = useState('')
  const [validMoves, setValidMoves] = useState(null)
  const [currentLevel, setCurrentLevel] = useState(0);
  const [lastMove, setLastMove] = useState('');
  const [error, setError] = useState('');
  const [moveMessage, setMoveMessage] = useState('');
  const [triggerLineMove, settriggerLineMove] = useState(null)
  const [linesOk, setLinesOk] = useState(initialLinesOk)
  const [currentTurn, setCurrentTurn] = useState('')
  const [levelLinesMoves, setLevelLinesMoves] = useState('')
  const [counters, setCounters] = useState(initialCounters)


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
            updatedLinesOk[key] = { ...updatedLinesOk[key], checked: true, good: true };
          }
        }
      }
      // Set the state with the updated object
      setLinesOk(updatedLinesOk);

      console.log(updatedLinesOk);
    } else if (moveMessage === 'NO') {
      console.log('no llega no');
      setCounters({ ...counters, badMoves: counters.badMoves + 1 });
    }
  }, [moveMessage]);



  const levelFen = {
    1: {
      fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3',
      validMoves: {
        line1: { move: 'Bc5', response: 'c3' },
        line2: { move: 'Nf6', response: 'd3' },
        line3: { move: 'Be7', response: 'd4' }
      },

    },
    2: {
      fen: 'r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/2P2N2/PP1P1PPP/RNBQK2R b KQkq - 0 4',
      validMoves: {
        line1: { move: 'Nf6', response: 'd4' },
        line2: { move: 'Qe7', response: 'd4' },
        line3: { move: 'd6', response: 'd4' }
      },

    },
    3: {
      fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2BPP3/2P2N2/PP3PPP/RNBQK2R b KQkq d3 0 5',
      validMoves: {
        line1: { move: 'exd4', response: 'e5' },
        line2: { move: 'Bb6', response: 'Nxe5' },
        line3: { move: 'Bd6', response: 'O-O' }
      },

    },
    4: {
      fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1P3/2Bp4/2P2N2/PP3PPP/RNBQK2R b KQkq - 0 6',
      validMoves: {
        line1: { move: 'd5', response: 'Be2' },
        line2: { move: 'Ne4', response: 'Bd5' },
        line3: { move: 'Ng4', response: 'cxd4' }
      },

    },
    5: {
      fen: 'r1bqk2r/ppp2ppp/2n2n2/2bpP3/3p4/2P2N2/PP2BPPP/RNBQK2R b KQkq - 1 7',
      validMoves: {
        line1: { move: 'Ne4', response: 'cxd4' },
        line2: { move: 'd3', response: 'exf6' },
        line3: { move: 'Ng8', response: 'cxd4' }
      },

    },
    6: {
      fen: 'r1bqk2r/ppp2ppp/2n5/2bpP3/3Pn3/5N2/PP2BPPP/RNBQK2R b KQkq - 0 8',
      validMoves: {
        line1: { move: 'Bb6', response: 'O-O' },
        line2: { move: 'Bb4', response: 'Bd2' },
        line3: { move: 'Be7', response: 'O-O' }
      },

    },
    7: {
      fen: 'r1bqk2r/ppp2ppp/1bn5/3pP3/3Pn3/5N2/PP2BPPP/RNBQ1RK1 b kq - 2 9',
      validMoves: {
        line1: { move: 'O-O', response: 'Nc3' },
        line2: { move: 'Bf5', response: 'Be3' },
        line3: { move: 'f6', response: 'Nc3' }
      },
    }
  };


  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '95vh', justifyContent: 'space-evenly' }} >
      Chess Project
      <span>LEVEL: {currentLevel}</span>
      <div> Good Mooves: {counters.goodMoves} -- Bad Mooves: {counters.badMoves}</div>
      {validMoves ? <span> ValidMove: {JSON.stringify(validMoves)} </span> : ''}
      <div className='gameContainer' style={{ width: '35%', minWidth: '375px' }}>
        <PlayRandomMoveEngine fen={fen} setFen={setFen} setLastMove={setLastMove} setError={setError} validMoves={validMoves} setValidMoves={setValidMoves} setMoveMessage={setMoveMessage} triggerLineMove={triggerLineMove} />
      </div>

      <div>
        <input type="text" value={lastMove} disabled />
        <span>{moveMessage}</span>
      </div>

      {currentLevel != 0 ?
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <button onClick={() => {
              if (validMoves == null && !linesOk.line1.good 
                // && levelLinesMoves == currentTurn
                ) {
                settriggerLineMove({ move: levelFen[currentLevel].validMoves.line1.move, fen: levelFen[currentLevel].fen })
                setLinesOk({ ...linesOk, line1: { checked: true, good: false } })
                setTimeout(() => {
                  setValidMoves(levelFen[currentLevel].validMoves.line1.response)
                }, 500)

              }
            }}>Line 1</button>
            {linesOk.line1.good ? <span>OK</span> : ''}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <button onClick={() => {
              if (validMoves == null && linesOk.line1.good && !linesOk.line2.good) {
                settriggerLineMove({ move: levelFen[currentLevel].validMoves.line2.move, fen: levelFen[currentLevel].fen })
                setLinesOk({ ...linesOk, line2: { checked: true, good: false } })
                setTimeout(() => {
                  setValidMoves(levelFen[currentLevel].validMoves.line2.response)
                }, 500)
              }
            }}>Line 2</button>
            {linesOk.line2.good ? <span>OK</span> : ''}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <button onClick={() => {
              if (validMoves == null && linesOk.line1.good && linesOk.line2.good && !linesOk.line3.good) {
                settriggerLineMove({ move: levelFen[currentLevel].validMoves.line3.move, fen: levelFen[currentLevel].fen })
                setLinesOk({ ...linesOk, line3: { checked: true, good: false } })
                setTimeout(() => {
                  setValidMoves(levelFen[currentLevel].validMoves.line3.response)
                }, 500)
              }
            }}>Line 3</button>
            {linesOk.line3.good ? <span>OK</span> : ''}
          </div>
        </div> : ''}

      <button onClick={() => {

        if (currentLevel <= 6) {
          setCurrentLevel(currentLevel + 1);
          settriggerLineMove({move: null, fen: levelFen[currentLevel + 1].fen});
          setLinesOk(initialLinesOk)
        } else {
          setCurrentLevel(1)
          settriggerLineMove({move: null, fen: levelFen[1].fen})
          setCounters(initialCounters)
        }
      }}>Next Level</button>

      {error != '' ? <span style={{ position: 'absolute', top: '4%', color: 'red', backgroundColor: 'pink', borderRadius: '5px', padding: '2px', fontSize: '1.5rem' }}>{error}</span> : ''}


    </div>
  )
}

export default App
