import "./ProductCard.css";
function ProductCard(props){
    return(
        <div className="product">
            <h3>{props.name}</h3>
            <p>{props.price}</p>
        </div>
    )
}
export default ProductCard;
