import { useState, useEffect, useCallback, useMemo } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
// import Engine from "./integration/Engine.ts";
import MovesBoard from '../components/MovesBorad'


export default function Game({ fen, setFen, setLastMove, setError, validMoves, setValidMoves, setMoveMessage, triggerLineMove, triggerValidationMove, setNewFen, isWhitesMove }) {
  const [game, setGame] = useState(new Chess());
  // const engine = useMemo(() => new Engine(), []);
  const [boardOrientation, setBoardOrientation] = useState('white');
  const [movesArray, setMovesArray] = useState([]);

  useEffect(() => {
    setFen(game.fen())
  }, [])


  //use engine
  // useEffect(() => {
  //   findEngineBestMove()
  // }, [game])

  useEffect(() => {
    if (triggerLineMove != null) {
      makeaButtonMove(triggerLineMove.move, triggerLineMove.fen)
    }
  }, [triggerLineMove])

  useEffect(() => {
    if (isWhitesMove != null) {
      if (isWhitesMove == true) {
        setBoardOrientation('white')
      } else {
        setBoardOrientation('black')
      }
    }
  }, [isWhitesMove])

  useEffect(() => {
    if (triggerValidationMove != false) {
      makeValidationMove()
    }
  }, [triggerValidationMove])

  // function findEngineBestMove() {
  //   engine.evaluatePosition(game.fen(), 10);
  //   engine.onMessage(({ bestMove }) => {
  //     if (bestMove) {
  //       game.move({
  //         from: bestMove.substring(0, 2),
  //         to: bestMove.substring(2, 4),
  //         promotion: bestMove.substring(4, 5),
  //       });
  //     }
  //   });
  // }

  const makeValidationMove = () => {
    const result = game.move({
      from: validMoves.substring(0, 2),
      to: validMoves.substring(2, 4),
      promotion: validMoves.substring(4, 5),
    });
    setLastMove({ from: result.from, to: result.to })
    game.undo(result);
  }

  const makeaButtonMove = (move, nextFen) => {
    // console.log(move, nextFen);
    const newGame = new Chess(nextFen);
    let result = '';

    if (move != null) {
      result = newGame.move({
        from: move.substring(0, 2),
        to: move.substring(2, 4),
        promotion: move.substring(4, 5),
      });

      if (result != null) {
        setLastMove({ from: result.from, to: result.to });
        updateMovesArray(`${result.from}${result.to}`, result.color);
        setNewFen(newGame.fen())
      }
    }
    // console.log('ddalepa', newGame.fen());
    setFen(newGame.fen())
    setGame(newGame);
    // console.log('>>>>>>>>>>>', newGame.fen())

    if (result == null) {
      setError('Impossible move')
      setTimeout(() => setError(''), 1000)
    }
  }


  const makeAMove = useCallback(
    (move) => {
      // console.log('>>>>>>>>>>>move', move, validMoves)

      const gameCopy = { ...game };
      const result = gameCopy.move(move);
      // console.log('>>>>>>>>>>>resulttt', result)


      // illegal move
      if (result === null) {
        setError('No Valid Move')
        setTimeout(() => {
          setError('')
        }, 1000);
        return false
      }


      if (validMoves != null && result != null && ((result?.to == validMoves?.to && result?.from == validMoves?.from) || (result?.to == validMoves) || (result?.san == validMoves) || (result?.from == validMoves.substring(0, 2) && result?.to == validMoves.substring(2, 4)))) {
        setMoveMessage({ message: 'OK', san: result.san });
        setTimeout(() => {
          setValidMoves(null)
          setMoveMessage({ message: '', san: '' })
        }, 400)
      } else if (validMoves != null) {
        setMoveMessage({ message: 'NO', san: '' })
        gameCopy.undo(move);
        setTimeout(() => {
          setMoveMessage({ message: '', san: '' })
        }, 400)
      }

      // console.log('>>>>>>>>>>> jugadaaaaaaa')
      setFen(gameCopy.fen())
      setGame(gameCopy);

      if (result != null) {
        setLastMove({ from: result.from, to: result.to });
        updateMovesArray(`${result.from}${result.to}`, result.color);
      }

      return result; // null if the move was illegal, the move object if the move was legal
    },
    [game, validMoves, fen]
  )


  function onDrop(sourceSquare, targetSquare) {
    makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",// always promote to a queen for example simplicity
    });

    return true;
  }

  const updateMovesArray = (move, color) => {
    const infoMove = { move: move, turn: color };
    setMovesArray([...movesArray, infoMove])
  };

  return (

    <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
      <div style={{ position: 'relative', width: '30%', minWidth: '375px' }}>
        <Chessboard position={fen} boardOrientation={boardOrientation} customDropSquareStyle={{ backgroundColor: '#FFFFCC' }} onPieceDrop={onDrop} />
      </div>
      {/* <MovesBoard movesArray={movesArray} /> */}
    </div>);
}