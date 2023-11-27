
const MovesBoard = ({movesArray}) => {

  return (
    <div style={{ width:'100px', padding:'10px', height: '200px', backgroundColor:'grey', overflow:'auto'}}>
       {movesArray.map((move, index) =>  (<div key={index} style={move.turn == 'w' ? {color:'white'} : {color:'black'}}>{move.move}</div>))}
    </div>
  )
};

export default MovesBoard;
