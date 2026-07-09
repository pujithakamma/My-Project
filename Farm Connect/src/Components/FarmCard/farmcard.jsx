import "./FarmCard.css";
function FarmCard(props){
    return(
        <div className="farm">
            <h3>{props.farmer}</h3>
            <p>{props.crop}</p>
            <p>{props.status}</p>
        </div>
    )
}
export default FarmCard;