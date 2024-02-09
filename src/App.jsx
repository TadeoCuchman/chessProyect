
import { useEffect, useState, useMemo } from 'react'
import './App.css'
import Game from './components/Game.jsx';
import InfoPopup from './components/InfoPopup.jsx';
import Engine from "./components/integration/Engine.ts";


const initialLinesOk = { 1: { checked: false, answer: false, good: false, afterMoveFen: '' }, 2: { checked: false, answer: false, good: false, afterMoveFen: '' }, 3: { checked: false, answer: false, good: false, afterMoveFen: '' } };
const initialCounters = { goodMoves: 0, badMoves: 0 };

function App() {
  const engine = useMemo(() => new Engine(), []);

  const [fen, setFen] = useState('');
  const [newFen, setNewFen] = useState('');
  const [levelFen, setLevelFen] = useState([]);
  const [rating, setRating] = useState(0);
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
  const [isWhitesMove, setIsWhitesMove] = useState(true);

  const [infoPopupOpen, setInfoPopupOpen] = useState(false);

  //engine 

  useEffect(() => {
    if(levelFen.length > 0) {
      findEnfgineBestMove(fen);
    }
  },[newFen])




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



  // fetch to players moves
  const fetchLichessMovesPerFen = (fenInterne) => {
    const parsedFen = fenInterne.replaceAll(' ', '%20');
    fetch(`https://explorer.lichess.ovh/lichess?variant=standard&speeds=rapid&ratings=${rating}&fen=` + parsedFen)
      .then(response => {
        return response.json();
      })
      .then(data => {
        console.log('LINES players LICHESS DATA', data);
        if(data.moves.length > 0){
          setLevelFen(prevVal => [...prevVal, transformLichessDataToLevel(fenInterne, data.moves)]);
          setCurrentLevel(currentLevel + 1);
          setTriggerLineMove({ move: null, fen: fenInterne });
          setLastMove({ from: 'ok', to: 'ok' });
          setBadMovesCounter(0);
          setLinesOk(initialLinesOk);
          setCenteredTextTop('Click "Next Variation" to see black’s most common move');
          setValidationButtonText('Next Variation');
          setValidationDisable(false);
        } else {
          setValidationButtonText('Ok');
          setCenteredTextTop('There is no more moves in the database.');
        }
      })
      .catch(error => {
        console.error('Fetch error:', error);
      });
  }

  const transformLichessDataToLevel = (fen, moves) => {

    console.log('>>>>>>>>>>>', moves)
    const result = {
      fen: fen,
      validMoves: {},
    };

    for (let i = 0; (i < moves.length) && (i < 3); i++) {
      const moveNumber = i + 1;

      result.validMoves[moveNumber] = {
        move: handleMove(moves[i].uci),
        response: '',
      };
    }
    return result;
  };


  function handleMove(move) {
    if (move == '' || move == null) return '';
    if (move == 'e1h1') return 'e1g1';
    if (move == 'e8h8') return 'e8g8';
    return move;
  }


  // fetch to best players best moves
  // const fetchLichessValidMovesPerFen = (fen) => {
  //   const parsedFen = fen.replaceAll(' ', '%20');
  //   fetch('https://explorer.lichess.ovh/lichess?variant=standard&speeds=rapid&ratings=2500&fen=' + parsedFen)
  //     .then(response => {
  //       return response.json();
  //     })
  //     .then(data => {
  //       console.log('LINES BEST PLAYER LICHESS DATA', data.topGames[0].uci, data);
  //       setValidMoves(data.topGames[0].uci);
  //       updateValidMove(currentLevel - 1, data.topGames[0].uci);
  //     })
  //     .catch(error => {
  //       console.error('Fetch error:', error);
  //     });
  // }

  // fetch to analysis
  // const fetchLichessValidMoves = (fen) => {
  //   const parsedFen = fen.replaceAll(' ', '%20');
  //   fetch('https://lichess.org/api/cloud-eval?multiPv=3&fen=' + parsedFen)
  //     .then(response => {
  //       return response.json();
  //     })
  //     .then(result => {
  //       const data = result;
  //       console.log('analysis data',data)
  //       if (result.error == 'Not found') {
  //         fetchLichessValidMovesPerFen(fen)
  //       } else {
  //         const pvs = separatePvs(data.pvs);
  //         let manyValidMoves = pvs.map(moves => moves.moves[0]);
  //         let manyValidMovesWithCps = pvs.map(moves => {return { move: moves.moves[0], cp: moves.cp}})
  //         console.log('>>>>>>>>>>>', manyValidMovesWithCps)
  //         setValidMoves(manyValidMoves);
  //         updateValidMove(currentLevel - 1, manyValidMovesWithCps);
  //       }
  //     })
  //     .catch(error => {
  //       console.error('Fetch error:', error);
  //     });
  // }

  function findEnfgineBestMove(fen) {
    engine.evaluatePosition(fen, 10);
    setTimeout(() =>{ 
      const validMoveInternal = engine.getLastValidMove();
      console.log(validMoveInternal)
      setLevelFen((prev) => {
        const newData = [...prev];
        console.log(newData)
        const validMoves = { ...newData[currentLevel - 1].validMoves };
        for (const key in validMoves) {
          if (!linesOk[key].answer) {
            if (validMoves.hasOwnProperty(key)) {
              validMoves[key].response = {move: validMoveInternal.move, cp: validMoveInternal.cp};
            }
          }
        }
        setValidMoves(validMoveInternal.move);

  
        newData[currentLevel - 1].validMoves = validMoves;
        console.log(newData);
        return newData;
      });
    },500)

     
   
  }

  // function updateValidMove(index, responseWithCps) {

  //   setLevelFen((prev) => {
  //     const newData = [...prev];
  //     const validMoves = { ...newData[index].validMoves };

  //     for (const key in validMoves) {
  //       if (!linesOk[key].answer) {
  //         if (validMoves.hasOwnProperty(key)) {
  //           validMoves[key].response = responseWithCps;
  //         }
  //       }
  //     }

  //     newData[index].validMoves = validMoves;
  //     console.log(newData);
  //     return newData;
  //   });
  // }

  // function separatePvs(pvs) {
  //   return pvs.map((pv) => ({
  //     moves: pv.moves.split(' ').map((move) => handleMove(move)),
  //     cp: pv.cp
  //   }));
  // }

  // useEffect(() => {
  //   if (newFen != '') {
  //     fetchLichessValidMoves(newFen);
  //   }
  // }, [newFen])

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
  const chargeGame = (gameName, worb) => {
    if(worb == 'w'){
      setIsWhitesMove(true);
    } else if (worb == 'b'){
      setIsWhitesMove(false);
    }

    if (validMoves == null && !linesOk[1].good) {
      switch (gameName) {
        case 'italian':
          fetchLichessMovesPerFen('r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3');
          break;
        case 'sicilian':
          fetchLichessMovesPerFen('rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2');
          break;
        case 'ruylopez':
          fetchLichessMovesPerFen('r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3');
          break;
        case 'french':
          fetchLichessMovesPerFen('rnbqkbnr/ppp2ppp/4p3/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq d6 0 3');
          break;
        case 'scoth':
          fetchLichessMovesPerFen('r1bqkbnr/pppp1ppp/2n5/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq d3 0 3');
          break;
        case 'carokann':
          fetchLichessMovesPerFen('rnbqkbnr/pp2pppp/2p5/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq d6 0 3');
          break;
        default:
          break;
      }
    }
    setCounters(initialCounters)
    setBadMovesCounter(0);
    setShowOppeningsTable(false)
  }

  const levelPassed = () => {
    setCenteredTextTop('CONGRATULATIONS! You guessed all the best moves!')
    setCenteredTextBot('');
  }

  //this converts to pawns on white perspective
  // const convertCp = (cp) => {
  //   return cp / 100;
  // }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-evenly', textAlign: 'center' }} >
      <h3>LEVEL: {currentLevel}</h3>
      <h6>Rating: {rating}</h6>
      <div style={{ position: 'absolute', top: '20px', width: '100%', display: 'flex', justifyContent: 'space-around' }}>
        <div><span style={{ color: 'green' }}>CORRECT MOVES</span> : {counters.goodMoves} </div>
        <div><span style={{ color: 'red' }}>WRONG MOVES</span> : {counters.badMoves}</div>
      </div>



      {showOppeningsTable ? 
      <>
      <select name="levelpicklist" onChange={(e) => setRating(e.target.value)}>
        <option value="0">0-1000</option>
        <option value="1000">1000-1200</option>
        <option value="1200">1200-1400</option>
        <option value="1400">1400-1600</option>
        <option value="1600">1600-1800</option>
        <option value="1800">1800-2000</option>
        <option value="2000">2000-2200</option>
        <option value="2500">2200-2500</option>
      </select>
      
      <table>
          <thead>
            <tr>
              <th>WHITE PIECES</th>
              <th>BLACK PIECES</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><button onClick={() => chargeGame("italian",'w')}>Italian Game</button></td>
              <td><button onClick={() => chargeGame("sicilian",'b')}>Sicilian Defense</button></td>
            </tr>
            <tr>
              <td><button onClick={() => chargeGame("ruylopez",'w')}>Ruy-Lopez</button></td>
              <td><button onClick={() => chargeGame("french",'b')}>French Defense</button></td>
            </tr>
            <tr>
              <td><button onClick={() => chargeGame("scoth",'w')}>Scotch Game</button></td>
              <td><button onClick={() => chargeGame("carokann'b'",)}>Caro-Kann</button></td>
            </tr>
          </tbody>
        </table>
      </>
         :

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

            {/* {setTimeout(() => {
              const validMoves = levelFen[currentLevel - 1].validMoves; // Assuming levelFen is an array of objects
              const keys = Object.keys(validMoves);

              keys.map((key) => {
                const validMove = validMoves[key];
                return (
                  <div style={{ position: 'relative' }} key={key}>
                    {linesOk[1].checked ? (
                      <>
                        <span>Cp: {convertCp(validMove.cp)}</span>
                        <span>Black’s move: {validMove.move}</span>
                        <span>White’s move: {linesOk[1].good ? validMove.response : '?'}</span>
                        <span>Result: {!linesOk[1].answer ? '' : (linesOk[1].good ? 'CORRECT' : 'WRONG')}</span>
                      </>
                    ) : ''}
                    {linesOk[3].good ? (
                      <button className='continueButton' disabled={validMove.moves ? validMove.moves : ''} onClick={() => {
                        fetchLichessMovesPerFen(linesOk[1].afterMoveFen);
                      }}> Continue </button>
                    ) : ''}
                  </div>
                );
              });
            }, 300)

            } */}

            <div style={{ position: 'relative' }}>
              {linesOk[1].checked ?
                <>
                  <span>Cp:  {linesOk[1].good ? levelFen[currentLevel - 1].validMoves[1].response.cp : '?'}</span>
                  <span>Black’s move: {levelFen[currentLevel - 1].validMoves[1].move}</span>
                  <span>White’s move: {linesOk[1].good ? levelFen[currentLevel - 1].validMoves[1].response.move : '?'} </span>
                  <span>Result: {!linesOk[1].answer ? '' : (linesOk[1].good ? 'CORRECT' : 'WRONG')}</span>
                </> : ''}
              {linesOk[1].good ?
                <button className='continueButton' disabled={levelFen[currentLevel - 1].validMoves[1].moves ? levelFen[currentLevel - 1].validMoves[1].moves : ''} onClick={() => {
                  fetchLichessMovesPerFen(linesOk[1].afterMoveFen);
                  setTimeout(() => {
                    findEnfgineBestMove(fen)
                  }, 400);
                }}> Continue </button> : ''}

            </div>

            <div style={{ position: 'relative' }}>
              {linesOk[2].checked ? 
                <>
                  <span>Cp:  {linesOk[1].good ? levelFen[currentLevel - 1].validMoves[2].response.cp : '?'}</span>
                  <span>Black’s move:  {levelFen[currentLevel - 1].validMoves[2].move}</span>
                  <span>White’s move: {linesOk[2].good ? levelFen[currentLevel - 1].validMoves[2].response.move : '?'} </span>
                  <span>Result: {!linesOk[2].answer ? '' : (linesOk[2].good ? 'CORRECT' : 'WRONG')}</span>
                </> : ''}
              {linesOk[2].good ?
                <button className='continueButton' disabled={levelFen[currentLevel - 1].validMoves[2].moves ? levelFen[currentLevel - 1].validMoves[2].moves : ''} onClick={() => {
                  fetchLichessMovesPerFen(linesOk[2].afterMoveFen);
                }}> Continue </button> : ''}
            </div>

            <div style={{ position: 'relative' }}>
              {linesOk[3].checked ?
                <>
                  <span>Cp:  {linesOk[1].good ? levelFen[currentLevel - 1].validMoves[3].response.cp : '?'}</span>
                  <span>Black’s move:  {levelFen[currentLevel - 1].validMoves[3].move}</span>
                  <span>White’s move: {linesOk[3].good ? levelFen[currentLevel - 1].validMoves[3].response.move : '?'} </span>
                  <span>Result: {!linesOk[3].answer ? '' : (linesOk[3].good ? 'CORRECT' : 'WRONG')}</span>
                </> : ''}
              {linesOk[3].good ?
                <button className='continueButton' disabled={levelFen[currentLevel - 1].validMoves[3].moves ? levelFen[currentLevel - 1].validMoves[3].moves : ''} onClick={() => {
                  fetchLichessMovesPerFen(linesOk[3].afterMoveFen);
                }}> Continue </button> : ''}
            </div>
          </div>
          <span style={{ margin: '10px' }}>{centeredTextBot}</span>
        </div>
      }

      <div className='gameContainer' style={{position: 'relative', width: '100%', minWidth: '375px', maxWidth: '450px' }}>
        <Game fen={fen} setFen={setFen} setLastMove={setLastMove} setError={setError} validMoves={validMoves} setValidMoves={setValidMoves} setMoveMessage={setMoveMessage} triggerLineMove={triggerLineMove} triggerValidationMove={triggerValidationMove} setNewFen={setNewFen} isWhitesMove={isWhitesMove}/>
      </div>

      {error != '' ? <span style={{ position: 'absolute', top: '4%', color: 'red', backgroundColor: 'pink', borderRadius: '5px', padding: '2px', fontSize: '1.5rem' }}>{error}</span> : ''}
      {infoPopupOpen ? <InfoPopup correctMove={validMoves} description='' setInfoPopupOpen={setInfoPopupOpen} /> : ""}
    </div>
  )
}

export default App
