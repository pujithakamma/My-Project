import "./StatsCard.css";
function StatsCard(props){
    return(
        <div className="card">
            <h3>{props.title}</h3>
            <h2>{props.value}</h2>
        </div>
    )
}
export default StatsCard;
