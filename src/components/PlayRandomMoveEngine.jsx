/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import {Chess} from "chess.js";
import { Chessboard } from "react-chessboard";

export default function PlayRandomMoveEngine({fen, setFen, setLastMove, setError, validMoves, setValidMoves, setMoveMessage, triggerMove}) {
  const [game, setGame] = useState(new Chess());
  const [boardOrientation, setBoardOrientation] = useState('white');

  useEffect(() => {
    if(fen != ''){
      // const orientation = fen.split(' ')[2];
      // if(orientation == 'b'){
        // setBoardOrientation(orientation);
      // }
      setGame(new Chess(fen))
    } else {
      setFen(game.fen())
    }
  }, [fen])

  useEffect(() => {
    if(triggerMove != null){
      makeButtonMove(triggerMove)
    }
  },[triggerMove])

  const makeButtonMove = (move) => {
    let result = makeAMove(move)

    if(result == null){
      setError('impossible move')
      setTimeout(() => setError(''),1000)
    }
  }


  function makeAMove(move) {
    if(validMoves != null && move?.to == validMoves.to && move?.from == validMoves.from){
      setMoveMessage('OK')
      setValidMoves(null)
      setTimeout(() => {
        setMoveMessage('')
      }, 1000)
    }else if (validMoves  != null){
      setMoveMessage('NO')
      setTimeout(() => {
        setMoveMessage('')
      }, 500)
      return false
    }

    const gameCopy = { ...game };
    const result = gameCopy.move(move);

    setFen(gameCopy.fen())
    setGame(gameCopy);

    if(result != null){
      setLastMove(result.to);
    }

    return result; // null if the move was illegal, the move object if the move was legal
  }


  function onDrop(sourceSquare, targetSquare) {
    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // always promote to a queen for example simplicity
    });

    // illegal move
    if (move === null) {
      setError('No Valid Move')
      setTimeout(() => {
        setError('')
      }, 1000);
      return false
    };
    
    return true;
  }

  return <Chessboard position={fen} boardOrientation={boardOrientation} onPieceDrop={onDrop}/>;
}