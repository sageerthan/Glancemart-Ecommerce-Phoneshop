import { Fragment } from "react"
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { decreaseCartItemQty, increaseCartItemQty, removeItemFromCart } from "../../slices/cartSlice";
import { MetaData } from "../layouts/MetaData";


export const Cart = () => {
    const { items: cartItems } = useSelector(state => state.cartState);
    const dispatch=useDispatch();
    const navigate=useNavigate();

    const increaseQty = (item) => {
        const count = item.quantity;
        if(item.stock ===0 ||  count >= item.stock) return;
        dispatch(increaseCartItemQty(item.product))
    }
    const decreaseQty = (item) => {
        const count = item.quantity;
        if(count === 1) return;
        dispatch(decreaseCartItemQty(item.product))
    }
    const checkoutHandler=()=>{
         navigate('/login?redirect=shipping');
    }
    return (
        <Fragment>
            <MetaData title={'Ordered items'}/>
            {cartItems.length === 0 ?
                <h2 className='mt-5 text-center'>Your cart is Empty</h2> :
                <Fragment>
                    <div className="container container-fluid">
                        <h2 className="mt-5">Your Cart: <b>{cartItems.length} items</b></h2>


                        <div className="row d-flex justify-content-between">
                            <div className="col-12 col-lg-8">
                                {
                                     cartItems.map((cartItem) => (
                                        <Fragment key={cartItem.product}>
                                            <hr />
                                            <div className="cart-item">
                                                <div className="row">
                                                    <div className="col-4 col-lg-3">
                                                        <img src={cartItem.image} alt={cartItem.name} height="90" width="115" />
                                                    </div>

                                                    <div className="col-5 col-lg-3">
                                                        <Link to={`/products/${cartItem.product}`}>{cartItem.name}</Link>
                                                    </div>


                                                    <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                                                        <p id="card_item_price">${cartItem.price}</p>
                                                    </div>

                                                    <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                                                        <div className="stockCounter d-inline">
                                                            <span className="btn btn-danger minus" onClick={()=>decreaseQty(cartItem)}>-</span>
                                                            <input type="number" className="form-control count d-inline" value={cartItem.quantity} readOnly />

                                                            <span className="btn btn-primary plus" onClick={()=>increaseQty(cartItem)} >+</span>
                                                        </div>
                                                    </div>

                                                    <div className="col-4 col-lg-1 mt-4 mt-lg-0">
                                                        <i id="delete_cart_item" className="fa fa-trash btn btn-danger" onClick={()=>dispatch(removeItemFromCart(cartItem.product))}></i>
                                                    </div>

                                                </div>
                                            </div>
                                        </Fragment>

                                    ))
                                }
                            </div>
                            <div className="col-12 col-lg-3 my-4">
                                <div id="order_summary">
                                    <h4>Order Summary</h4>
                                    <hr />
                                    <p>Subtotal:  <span className="order-summary-values">{cartItems.reduce((acc,item)=>(acc+item.quantity),0)} (Units)</span></p>
                                    <p>Est. total: <span className="order-summary-values">${Number(cartItems.reduce((acc,item)=>(acc+(item.price*item.quantity)),0)).toFixed(2)}</span></p>

                                    <hr />
                                    <button id="checkout_btn" className="btn btn-primary btn-block" onClick={checkoutHandler}>Check out</button>
                                </div>
                            </div>
                        </div>


                    </div>
                </Fragment>
            }
        </Fragment>
    )
}

