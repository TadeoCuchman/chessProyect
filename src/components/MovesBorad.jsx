
import { useRef, useEffect } from "react";

const MovesBoard = ({movesArray}) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({behavior: 'smooth'});
  }, [movesArray]);

  return (
    <div style={{ width:'100px', padding:'10px', height: '200px', backgroundColor:'grey', overflow:'auto'}}>
       {movesArray.map((move, index) =>  (<div key={index} style={move.turn == 'w' ? {color:'white'} : {color:'black'}}>{move.move}</div>))}
       <div ref={bottomRef} />
    </div>
  )
};

export default MovesBoard;
