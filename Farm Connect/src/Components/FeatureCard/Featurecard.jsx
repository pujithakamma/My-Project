import "./FeatureCard.css";
function FeatureCard(props){
    return(
        <div className="feature">
            <h2>{props.title}</h2>
            <p>{props.description}</p>
        </div>
    )
}
export default FeatureCard;