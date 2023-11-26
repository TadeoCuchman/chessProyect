import { useState, useEffect } from "react";

const MovesBoard = ({movesArray}) => {

  return (
    <div style={{ width:'100px', padding:'10px', height: '375px', backgroundColor:'grey'}}>
       {movesArray.map((move, index) =>  (<div key={index}>{move}</div>))}
    </div>
  )
};

export default MovesBoard;
