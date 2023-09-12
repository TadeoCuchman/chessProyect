import './InfoPopup.css';

const InfoPopup = ({ description, correctMove, setInfoPopupOpen }) => {



    return (
        <div className="infoPopupContainer">
            <div className="infoPopup">
                <div style={{display:'flex', flexDirection: 'column'}}>
                    <span>Valid Move:</span>
                    <span>{correctMove}</span>
                </div>
                <div style={{display:'flex', flexDirection: 'column'}}>
                    <span>Description:</span>
                    <p>{description}</p>
                </div>

                <button onClick={() => setInfoPopupOpen(false)}>OK</button>
            </div>
        </div>
    )
};

export default InfoPopup;
