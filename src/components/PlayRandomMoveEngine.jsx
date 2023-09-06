/* eslint-disable react/prop-types */
import { useState, useEffect, useCallback } from "react";
import {Chess} from "chess.js";
import { Chessboard } from "react-chessboard";

export default function PlayRandomMoveEngine({fen, setFen, setLastMove, setError, validMoves, setValidMoves, setMoveMessage, triggerLineMove}) {
  const [game, setGame] = useState(new Chess());
  const [boardOrientation, setBoardOrientation] = useState('white');
  // const [turn, setTurn] = useState('w');

  useEffect(() => {
    setFen(game.fen())
  }, [])


  useEffect(() => {
    
    if(triggerLineMove != null){
      makeaButtonMove(triggerLineMove.move, triggerLineMove.fen)
    }
  },[triggerLineMove])



  const makeaButtonMove = (move, nextFen) => {
    const newGame = new Chess(nextFen);
    let result = '';

    if(move != null) {
      result = newGame.move(move);
    }
    
    setFen(newGame.fen())
    setGame(newGame);

    if(result == null){
      setError('Impossible move')
      setTimeout(() => setError(''), 1000)
    }
  }


  const makeAMove = useCallback(
    (move) => {
      console.log('>>>>>>>>>>>move', move, validMoves)
      
      const gameCopy = { ...game };
      const result = gameCopy.move(move);
      console.log('>>>>>>>>>>>resulttt', result)
    

      // illegal move
      if (result === null) {
        setError('No Valid Move')
        setTimeout(() => {
          setError('')
        }, 1000);
        return false
      };
      

      if(validMoves != null && result != null && ((result?.to == validMoves?.to && result?.from == validMoves?.from) || (result?.to == validMoves) || (result?.san == validMoves))){
        setMoveMessage('OK')
        setValidMoves(null)
        setTimeout(() => {
          setMoveMessage('')
        }, 1000)
      }else if (validMoves  != null){
        setMoveMessage('NO')
        gameCopy.undo(move);
        setTimeout(() => {
          setMoveMessage('')
        }, 1000)
        return false
      }

      // console.log('>>>>>>>>>>> jugadaaaaaaa')
      setFen(gameCopy.fen())
      setGame(gameCopy);

      if(result != null){
        setLastMove(result.to);
      }

      return result; // null if the move was illegal, the move object if the move was legal
    },
    [game, validMoves, fen]
    )


  function onDrop(sourceSquare, targetSquare) {
    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",// always promote to a queen for example simplicity
    });

    return true;
  }

  return <Chessboard position={fen} boardOrientation={boardOrientation} onPieceDrop={onDrop}/>;
}