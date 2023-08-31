import { useState } from 'react'
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

  const levelFen = {
    1: {fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3', validMoves: {from:'a7', to:'a6'}},
    2: {fen: 'r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/2P2N2/PP1P1PPP/RNBQK2R b KQkq - 0 4', validMoves: {from:'a7', to:'a6'}},
    3: {fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2BPP3/2P2N2/PP3PPP/RNBQK2R b KQkq d3 0 5', validMoves: {from:'a7', to:'a6'}},
    4: {fen: 'r1bqk2r/pppp1ppp/2n2n2/2b5/2BPP3/5N2/PP3PPP/RNBQK2R b KQkq - 0 6', validMoves: {from:'a7', to:'a6'}},
    5: {fen: 'r1bqk2r/pppp1ppp/2n2n2/8/1bBPP3/5N2/PP1B1PPP/RN1QK2R b KQkq - 2 7', validMoves: {from:'a7', to:'a6'}},
    6: {fen: 'r1bqk2r/pppp1ppp/2n2n2/8/2BPP3/5N2/PP1N1PPP/R2QK2R b KQkq - 0 8', validMoves: {from:'a7', to:'a6'}},
    7: {fen: 'r1bqk2r/ppp2ppp/2n2n2/3P4/2BP4/5N2/PP1N1PPP/R2QK2R b KQkq - 0 9', validMoves: {from:'a7', to:'a6'}}
}

  return (
   <div style={{display: 'flex', flexDirection:'column', alignItems:'center', height:'100vh', justifyContent: 'space-evenly'}} >
    Chess Project
    {validMoves ? <span> ValidMove: {validMoves.from + ' ' + validMoves. to}</span> : ''}
    <div className='gameContainer' style={{width: '40%', minWidth:'500px'}}>
      <PlayRandomMoveEngine fen={fen} setFen={setFen} setLastMove={setLastMove} setError={setError} validMoves={validMoves} setValidMoves={setValidMoves} setMoveMessage={setMoveMessage} triggerMove={triggerMove}/>
    </div>
    <div>
      <button onClick={() => {
        setFen(levelFen[currentLevel + 1].fen);
        setValidMoves(levelFen[currentLevel + 1].validMoves);

        if(currentLevel < 6){
          setCurrentLevel(currentLevel + 1);

        }else{
          setCurrentLevel(1)
        }
      }}>Next</button>
      <button onClick={() => {
        setTriggerMove({from:'a2', to:'a3'})
      }}>
         Make a move
      </button>
    </div>
    <div>
      <input type="text" value={lastMove} disabled />
      <span>{moveMessage}</span>
    </div>
    {error != '' ? <span style={{position:'absolute', top:'4%' ,color: 'red', backgroundColor:'pink', borderRadius: '5px', padding: '2px', fontSize: '1.5rem'}}>{error}</span> : ''}


   </div>
  )
}

export default App
