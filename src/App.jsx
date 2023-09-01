import { useEffect, useState } from 'react'
import './App.css'
import PlayRandomMoveEngine from './components/PlayRandomMoveEngine.jsx';
function App() {
  const [fen, setFen] = useState('')
  const [validMoves, setValidMoves] = useState(null)
  const [currentLevel, setCurrentLevel] = useState(0);
  const [lastMove, setLastMove] = useState('');
  const [error, setError] = useState('');
  const [moveMessage, setMoveMessage] = useState('');
  const [triggerMove, setTriggerMove] = useState(null)
  const [linesOk, setLinesOk] = useState({ line1: { checked: false, good: false }, line2: { checked: false, good: false }, line3: { checked: false, good: false } })
  const [currentTurn, setCurrentTurn] = useState('')
  const [levelLinesMoves,setLevelLinesMoves] = useState('')
  const [counter, setCounter] = useState({ goodMoves: 0, badMooves: 0 })


  
  useEffect(() => {
    const firstFen = levelFen[currentLevel + 1].fen
    setLevelLinesMoves(firstFen.split(' ')[1])
  },[currentLevel])

  useEffect(() => {
    const orientation = fen.split(' ')[1];
    setCurrentTurn(orientation);
  },[fen])


  useEffect(() => {
    if (validMoves == null && moveMessage === 'OK') {
      setCounter({ ...counter, goodMoves: counter.goodMoves + 1 });

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
      setCounter({ ...counter, badMoves: counter.badMoves + 1 });
    }
  }, [moveMessage]);



  const levelFen = {
    1: {
      fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3',
      validMoves: {
        from: 'a7', to: 'a6'
      },
      line1: { move: 'Bc5', response: 'c3' },
      line2: { move: 'Nf6', response: 'd3' },
      line3: { move: 'Be7', response: 'd4' }
    },
    2: {
      fen: 'r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/2P2N2/PP1P1PPP/RNBQK2R b KQkq - 0 4',
      validMoves: {
        from: 'a7', to: 'a6'
      },
      line1: { move: 'Nf6', response: 'd4' },
      line2: { move: 'Qe7', response: 'd4' },
      line3: { move: 'd6', response: 'd4' }
    },
    3: {
      fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2BPP3/2P2N2/PP3PPP/RNBQK2R b KQkq d3 0 5',
      validMoves: {
        from: 'a7', to: 'a6'
      },
      line1: { move: 'exd4', response: 'e5' },
      line2: { move: 'Bb6', response: 'Nxe5' },
      line3: { move: 'Bd6', response: 'O-O' }
    },
    4: {
      fen: 'r1bqk2r/pppp1ppp/2n2n2/2b5/2BPP3/5N2/PP3PPP/RNBQK2R b KQkq - 0 6',
      validMoves: {
        from: 'a7', to: 'a6'
      },
      line1: { move: 'd5', response: 'Be2' },
      line2: { move: 'Ne4', response: 'Bd5' },
      line3: { move: 'Ng4', response: 'cxd4' }
    },
    5: {
      fen: 'r1bqk2r/pppp1ppp/2n2n2/8/1bBPP3/5N2/PP1B1PPP/RN1QK2R b KQkq - 2 7',
      validMoves: {
        from: 'a7', to: 'a6'
      },
      line1: { move: 'Ne4', response: 'cxd4' },
      line2: { move: 'd3', response: 'exf6' },
      line3: { move: 'Ng8', response: 'cxd4' }
    },
    6: {
      fen: 'r1bqk2r/pppp1ppp/2n2n2/8/2BPP3/5N2/PP1N1PPP/R2QK2R b KQkq - 0 8',
      validMoves: {
        from: 'a7', to: 'a6'
      },
      line1: { move: 'Bb6', response: 'O-O' },
      line2: { move: 'Be4', response: 'Bd2' },
      line3: { move: 'Be7', response: 'O-O' }
    },
    7: {
      fen: 'r1bqk2r/ppp2ppp/2n2n2/3P4/2BP4/5N2/PP1N1PPP/R2QK2R b KQkq - 0 9',
      validMoves: {
        from: 'a7', to: 'a6'
      },
      line1: { move: 'O-O', response: 'Nfe' },
      line2: { move: 'Bf5', response: 'Be3' },
      line3: { move: 'e6', response: 'Be3' }
    }
  };


  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '95vh', justifyContent: 'space-evenly' }} >
      Chess Project
      <div> Good Mooves: {counter.goodMoves} -- Bad Mooves: {counter.badMooves}</div>
      {validMoves ? <span> ValidMove: {JSON.stringify(validMoves)} </span> : ''}
      <div className='gameContainer' style={{ width: '35%', minWidth: '450px' }}>
        <PlayRandomMoveEngine fen={fen} setFen={setFen} setLastMove={setLastMove} setError={setError} validMoves={validMoves} setValidMoves={setValidMoves} setMoveMessage={setMoveMessage} triggerMove={triggerMove}/>
      </div>

      <div>
        <input type="text" value={lastMove} disabled />
        <span>{moveMessage}</span>
      </div>

      <button onClick={() => {
        setTriggerMove({ from: 'a2', to: 'a3' })
      }}>
        Make a move
      </button>

      {currentLevel != 0 ?
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <button onClick={() => {
              if (validMoves == null && !linesOk.line1.good && levelLinesMoves == currentTurn) {
                setTriggerMove(levelFen[currentLevel].line1.move)
                setLinesOk({ ...linesOk, line1: { checked: true, good: false } })
                setTimeout(() => {
                  setValidMoves(levelFen[currentLevel].line1.response)
                }, 500)

              }
            }}>Line 1</button>
            {linesOk.line1.good ? <span>OK</span> : ''}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <button onClick={() => {
              if (validMoves == null && linesOk.line1.good && !linesOk.line2.good ) {
                setTriggerMove(levelFen[currentLevel].line2.move)
                setLinesOk({ ...linesOk, line2: { checked: true, good: false } })
                setTimeout(() => {
                  setValidMoves(levelFen[currentLevel].line2.response)
                }, 500)
              }
            }}>Line 2</button>
            {linesOk.line2.good ? <span>OK</span> : ''}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <button onClick={() => {
              if (validMoves == null && linesOk.line1.good && linesOk.line2.good && !linesOk.line3.good) {
                setTriggerMove(levelFen[currentLevel].line3.move)
                setLinesOk({ ...linesOk, line3: { checked: true, good: false } })
                setTimeout(() => {
                  setValidMoves(levelFen[currentLevel].line3.response)
                }, 500)
              }
            }}>Line 3</button>
            {linesOk.line3.good ? <span>OK</span> : ''}
          </div>
        </div> : ''}

        <button onClick={() => {
        setFen(levelFen[currentLevel + 1].fen);
        setValidMoves(levelFen[currentLevel + 1].validMoves);
        setLinesOk({ line1: { checked: false }, line2: { checked: false }, line3: { checked: false } })
        if (currentLevel < 6) {
          setCurrentLevel(currentLevel + 1);

        } else {
          setCurrentLevel(1)
        }
      }}>Next Level</button>

      {error != '' ? <span style={{ position: 'absolute', top: '4%', color: 'red', backgroundColor: 'pink', borderRadius: '5px', padding: '2px', fontSize: '1.5rem' }}>{error}</span> : ''}


    </div>
  )
}

export default App
