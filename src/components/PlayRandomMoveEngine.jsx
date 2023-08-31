import { useState, useEffect } from "react";
import {Chess} from "chess.js";
import { Chessboard } from "react-chessboard";

export default function PlayRandomMoveEngine({fen, setFen, setLastMove, setError, validMoves, setValidMoves, setMoveMessage, triggerMove}) {
  const [game, setGame] = useState(new Chess());
  const [boardOrientation, setBoardOrientation] = useState('white');

  useEffect(() => {
    if(fen != ''){
      const orientation = fen.split(' ')[2];
      if(orientation == 'b'){
        setBoardOrientation(orientation);
      }
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
    console.log(result);
    if(result == null){
      setError('impossible move')
      setTimeout(() => setError(''),1000)
    }
  }



  function makeAMove(move, from) {

    console.log(validMoves);
    console.log(move?.from, move?.to);
    if(validMoves != null && move?.to == validMoves.to && move?.from == validMoves.from){
      setMoveMessage('OK')
      setValidMoves(null)
      setTimeout(() => {
        setMoveMessage('')
      }, 1000)
    }else if (validMoves  != null && from != 'computer'){
      setMoveMessage('NO')
      setTimeout(() => {
        setMoveMessage('')
      }, 500)
      return null
    }


    const gameCopy = { ...game };
    const result = gameCopy.move(move);

    console.log('here')
    setFen(gameCopy.fen())
    setGame(gameCopy);

    if(result != null){
      setLastMove(result.to);
    }

    return result; // null if the move was illegal, the move object if the move was legal
  }

  function makeRandomMove() {
    const possibleMoves = game.moves();
    if (game.game_over() || game.in_draw() || possibleMoves.length === 0)
      return; // exit if the game is over
    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    makeAMove(possibleMoves[randomIndex], "computer");
  }

  function onDrop(sourceSquare, targetSquare) {
    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // always promote to a queen for example simplicity
    });
    console.log(move);
    // illegal move
    if (move === null) {
      setError('No Valid Move')
      setTimeout(() => {
        setError('')
      }, 1000);
      return false
    };

    // setTimeout(makeRandomMove, 1000);
    
    return true;
  }

  return <Chessboard position={fen} boardOrientation={boardOrientation} onPieceDrop={onDrop}/>;
}