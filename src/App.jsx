/* eslint-disable no-prototype-builtins */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import './App.css'
import PlayRandomMoveEngine from './components/PlayRandomMoveEngine.jsx';
import InfoPopup from './components/InfoPopup';

const initialLinesOk = { 1: { checked: false, answer: false, good: false, afterMoveFen: '' }, 2: { checked: false, answer: false, good: false, afterMoveFen: '' }, 3: { checked: false, answer: false, good: false, afterMoveFen: '' } };
const initialCounters = { goodMoves: 0, badMoves: 0 };

function App() {
  const [fen, setFen] = useState('');
  const [levelFen, setLevelFen] = useState([]);
  const [validMoves, setValidMoves] = useState(null);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [error, setError] = useState('');
  const [moveMessage, setMoveMessage] = useState('');
  const [triggerLineMove, setTriggerLineMove] = useState(null);
  const [triggerValidationMove, setTriggerValidationMove] = useState(false);
  const [linesOk, setLinesOk] = useState(initialLinesOk);
  const [counters, setCounters] = useState(initialCounters);
  const [badMovesCounter, setBadMovesCounter] = useState(0)
  const [lastMove, setLastMove] = useState({ from: '', to: '' });
  const [beforeMoveStyles, setBeforeMoveStyles] = useState({ from: { square: '', color: '' }, to: { square: '', color: '' } })

  const [showOppeningsTable, setShowOppeningsTable] = useState(true);
  const [centeredTextTop, setCenteredTextTop] = useState('Click "Next Variation" to see black’s most common move');
  const [centeredTextBot, setCenteredTextBot] = useState('');
  const [validationButtonText, setValidationButtonText] = useState('Next Variation');
  const [validationDisable, setValidationDisable] = useState(false);

  const [infoPopupOpen, setInfoPopupOpen] = useState(false);


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

  // const fetchLichessMovesPerFen = (fen) => {
  //   const parsedFen = fen.replaceAll(' ', '%20');
  //   fetch('https://explorer.lichess.ovh/lichess?variant=standard&speeds=rapid&ratings=0&fen=' + parsedFen)
  //   .then(response => {
  //     return response.json();
  //   })
  //   .then(data => {
  //     setLevelFen(transformLichessDataToLevels(fen, data.moves, false));
  //     fetchLichessValidMove(fen)
  //   })
  //   .catch(error => {
  //     console.error('Fetch error:', error);
  //   });
  // }


  const fetchLichessValidMoves = (fen) => {
    const parsedFen = fen.replaceAll(' ', '%20');
    fetch('https://lichess.org/api/cloud-eval?multiPv=3&fen=' + parsedFen)
      .then(response => {
        return response.json();
      })
      .then(data => {
        setLevelFen(prevVal => [...prevVal, transformLichessDataToLevel(fen, separatePvs(data.pvs))])
        setCurrentLevel(currentLevel + 1)
        setTriggerLineMove({ move: null, fen: fen })
        setLastMove({ from: 'ok', to: 'ok' });
        setBadMovesCounter(0);
        setLinesOk(initialLinesOk);
        setCenteredTextTop('Click "Next Variation" to see black’s most common move');
        setValidationButtonText('Next Variation')
        setValidationDisable(false);
      })
      .catch(error => {
        console.error('Fetch error:', error);
      });
  }

  function separatePvs(pvs) {
    return pvs.map((pv) => ({
      moves: pv.moves.split(' ').map((move) => (move === "e1h1" ? "e1g1" : move)),
      cp: pv.cp
    }));
  }

  const transformLichessDataToLevel = (fen, moves) => {
    const result = {
      fen: fen,
      validMoves: {
        1: { move: moves[2].moves[0], response: moves[2].moves[1], cp: moves[2].cp },
        2: { move: moves[1].moves[0], response: moves[1].moves[1], cp: moves[1].cp },
        3: { move: moves[0].moves[0], response: moves[0].moves[1], cp: moves[0].cp }
      },
    }
    console.log(result);
    return result;
  }


  //show the correct moves when the popup displays
  useEffect(() => {
    if (infoPopupOpen == true && validMoves != null) {
      setTriggerValidationMove(true);
      setTimeout(() => {
        setTriggerValidationMove(false)
      }, 400)
    }
  }, [infoPopupOpen])

  //changes the color of the squares
  useEffect(() => {
    if (lastMove.to != '') {
      if (beforeMoveStyles.from.square != '') {
        let fromSquareBefore = document.querySelector(`[data-square= ${beforeMoveStyles.from.square}]`);
        let toSquareBefore = document.querySelector(`[data-square= ${beforeMoveStyles.to.square}]`);
        fromSquareBefore.style.backgroundColor = beforeMoveStyles.from.color;
        toSquareBefore.style.backgroundColor = beforeMoveStyles.to.color;
      }
      if (lastMove.to != 'ok') {
        let fromSquare = document.querySelector(`[data-square= ${lastMove.from}]`)
        let toSquare = document.querySelector(`[data-square= ${lastMove.to}]`)

        setBeforeMoveStyles({ from: { square: lastMove.from, color: fromSquare.style.backgroundColor }, to: { square: lastMove.to, color: toSquare.style.backgroundColor } });

        if (moveMessage == 'NO' && triggerValidationMove == true) {
          fromSquare.style.backgroundColor = 'green'
          toSquare.style.backgroundColor = 'green'
        } else if (moveMessage == 'NO') {
          fromSquare.style.backgroundColor = 'red'
          toSquare.style.backgroundColor = 'red'
        } else {
          fromSquare.style.backgroundColor = '#FFFF66'
          toSquare.style.backgroundColor = '#FFFF66'
        }
      }

    }
  }, [lastMove])

  // makes the validations of the moves and correct moves counters
  useEffect(() => {
    if (moveMessage === 'OK') {
      const updatedLinesOk = { ...linesOk };
      for (const key in updatedLinesOk) {
        if (updatedLinesOk.hasOwnProperty(key)) {
          if (updatedLinesOk[key].checked === true && updatedLinesOk[key].afterMoveFen == '') {
            console.log('showmessage', fen)
            updatedLinesOk[key] = { ...updatedLinesOk[key], checked: true, answer: true, good: true, afterMoveFen: fen }
          }
        }
      }
      setLinesOk(updatedLinesOk);
      setCounters({ ...counters, goodMoves: counters.goodMoves + 1 });
      if (!updatedLinesOk[3].good) {
        setCenteredTextTop("Congratulations! The move is CORRECT!")
        setCenteredTextBot("Click “Next Variation” to see the different black’s move")
        setValidationButtonText('Next Variation');
        setValidationDisable(false)
        setBadMovesCounter(0);
      } else {
        levelPassed();
      }

    } else if (moveMessage === 'NO') {
      const updatedLinesOk = { ...linesOk };
      for (const key in updatedLinesOk) {
        if (updatedLinesOk.hasOwnProperty(key)) {
          if (updatedLinesOk[key].checked === true && !updatedLinesOk[key].good) {
            updatedLinesOk[key] = { ...updatedLinesOk[key], checked: true, answer: true, good: false };
          }
        }
      }
      setLinesOk(updatedLinesOk);
      setCounters({ ...counters, badMoves: counters.badMoves + 1 });
      setBadMovesCounter(badMovesCounter + 1);
      setCenteredTextTop("It's not the best move in this position!")
      setCenteredTextBot('Try Again');
      setValidationButtonText('Try Again');
      setValidationDisable(false);
      if (badMovesCounter > 1) {
        setInfoPopupOpen(true);
      }
      setTimeout(() => {
        setCenteredTextBot('Guess the best move for white');
      }, 700)
    }
  }, [moveMessage]);

  //provsory before database
  const chargeGame = (gameName) => {
    switch (gameName) {
      case 'italian':
        if (validMoves == null && !linesOk[1].good) {
          fetchLichessValidMoves('r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3');
        }
        break;
      default:
        break;
    }
    setCounters(initialCounters)
    setBadMovesCounter(0);
    setShowOppeningsTable(false)
  }

  const levelPassed = () => {
    setCenteredTextTop('CONGRATULATIONS! You guessed all the best moves!')
    setCenteredTextBot('');
  }

  const convertCp = (cp) => {
    return cp / 100;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '95vh', justifyContent: 'space-evenly', textAlign: 'center' }} >
      <h3>LEVEL: {currentLevel}</h3>
      <div style={{ position: 'absolute', top: '20px', width: '100%', display: 'flex', justifyContent: 'space-around' }}>
        <div><span style={{ color: 'green' }}>CORRECT MOVES</span> : {counters.goodMoves} </div>
        <div><span style={{ color: 'red' }}>WRONG MOVES</span> : {counters.badMoves}</div>
      </div>

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
          <span>{centeredTextTop}</span>

          {!linesOk[3].good ?
            <button style={{ marginTop: '10px' }} disabled={validationDisable} onClick={() => {
              if (validationButtonText == 'Next Variation') {
                let line = 0;
                const updatedLinesOk = { ...linesOk };
                for (const key in updatedLinesOk) {
                  if (updatedLinesOk.hasOwnProperty(key)) {
                    if (updatedLinesOk[key].checked === false) {
                      updatedLinesOk[key] = { ...updatedLinesOk[key], checked: true, answer: false, good: false };
                      setValidationDisable(true);
                      line = key;
                      break;
                    }
                  }
                }
                if (line > 0) {
                  setValidMoves(levelFen[currentLevel - 1].validMoves[line].response)
                  setTriggerLineMove({ move: levelFen[currentLevel - 1].validMoves[line].move, fen: levelFen[currentLevel - 1].fen })
                }
                setLinesOk(updatedLinesOk);
                setCenteredTextTop('This is one of the most common moves that black plays in this position.')
                setCenteredTextBot('Guess the best move for white')
              }
            }}>{validationButtonText}</button>
            : 'Click the Continue button below desired variation to move to the next move in this line.'}

          <div className='variationsBoxes'>
            <div style={{ position: 'relative' }}>
              {linesOk[1].checked ?
                <>
                  <span>Cp:  { convertCp(levelFen[currentLevel - 1].validMoves[1].cp) }</span>
                  <span>Black’s move: {levelFen[currentLevel - 1].validMoves[1].move}</span>
                  <span>White’s move: {linesOk[1].good ? levelFen[currentLevel - 1].validMoves[1].response : '?'} </span>
                  <span>Result: {!linesOk[1].answer ? '' : (linesOk[1].good ? 'CORRECT' : 'WRONG')}</span>
                </> : ''}
              {linesOk[3].good ?
                <button className='continueButton' onClick={() => {
                  fetchLichessValidMoves(linesOk[1].afterMoveFen);
                }}> Continue </button> : ''}

            </div>

            <div style={{ position: 'relative' }}>
              {linesOk[2].checked ?
                <>
                  <span>Cp:  { convertCp(levelFen[currentLevel - 1].validMoves[2].cp) }</span>
                  <span>Black’s move:  {levelFen[currentLevel - 1].validMoves[2].move}</span>
                  <span>White’s move: {linesOk[2].good ? levelFen[currentLevel - 1].validMoves[2].response : '?'} </span>
                  <span>Result: {!linesOk[2].answer ? '' : (linesOk[2].good ? 'CORRECT' : 'WRONG')}</span>
                </> : ''}
              {linesOk[3].good ?
                <button className='continueButton' onClick={() => {
                  fetchLichessValidMoves(linesOk[2].afterMoveFen);
                }}> Continue </button> : ''}
            </div>

            <div style={{ position: 'relative' }}>
              {linesOk[3].checked ?
                <>
                  <span>Cp:  { convertCp(levelFen[currentLevel - 1].validMoves[3].cp) }</span>
                  <span>Black’s move:  {levelFen[currentLevel - 1].validMoves[3].move}</span>
                  <span>White’s move: {linesOk[3].good ? levelFen[currentLevel - 1].validMoves[3].response : '?'} </span>
                  <span>Result: {!linesOk[3].answer ? '' : (linesOk[3].good ? 'CORRECT' : 'WRONG')}</span>
                </> : ''}
              {linesOk[3].good ?
                <button className='continueButton' onClick={() => {
                  fetchLichessValidMoves(linesOk[3].afterMoveFen);
                }}> Continue </button> : ''}
            </div>
          </div>
          <span style={{ margin: '10px' }}>{centeredTextBot}</span>
        </div>
      }

      <div className='gameContainer' style={{ width: '35%', minWidth: '375px' }}>
        <PlayRandomMoveEngine fen={fen} setFen={setFen} setLastMove={setLastMove} setError={setError} validMoves={validMoves} setValidMoves={setValidMoves} setMoveMessage={setMoveMessage} triggerLineMove={triggerLineMove} triggerValidationMove={triggerValidationMove} />
      </div>


      {error != '' ? <span style={{ position: 'absolute', top: '4%', color: 'red', backgroundColor: 'pink', borderRadius: '5px', padding: '2px', fontSize: '1.5rem' }}>{error}</span> : ''}
      {infoPopupOpen ? <InfoPopup correctMove={validMoves} description='' setInfoPopupOpen={setInfoPopupOpen} /> : ""}
    </div>
  )
}

export default App
