import { MetaData } from "../layouts/MetaData";
import { Fragment, useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { orderDetail as orderDetailAction } from "../../actions/orderActions";
import { toast } from 'react-toastify';
import { updateOrder } from "../../actions/orderActions";
import { clearOrderError, clearOrderUpdated } from "../../slices/orderSlice";
import { Link } from "react-router-dom";
export const UpdateOrder = () => {

    const { loading, isOrderUpdated, error, orderDetail={} } = useSelector(state => state.orderState);
    const { user={}, orderItems=[], shippingInfo={}, totalPrice=0, paymentInfo={} } = orderDetail;
    const isPaid = paymentInfo.status === 'succeeded' ? true : false;
    const [orderStatus, setOrderStatus] = useState('Processing');
    const { id } = useParams();
    const dispatch = useDispatch();

    const submitHandler = (e) => {
        e.preventDefault();
        const orderData = {};
        orderData.orderStatus = orderStatus;
        dispatch(updateOrder(id, orderData))
    }

    useEffect(() => {

        if (isOrderUpdated) {
            toast('Order updated successfully!', {
                type: 'success',
                onOpen: () => { dispatch(clearOrderUpdated()) }
            })
            return
        }
        if (error) {
            toast(error, {
                type: 'error',
                onOpen: () => { dispatch(clearOrderError()) }
            })
            return;
        }
        dispatch(orderDetailAction(id))
    }, [isOrderUpdated, error, dispatch,id])

    useEffect(() => {
        if (orderDetail._id) {
            setOrderStatus(orderDetail.orderStatus)
        }
    }, [orderDetail])

    return (
        <Fragment>
            <MetaData title="Update Product" />
            <div className='row'>
                <div className="col-12 col-md-2">
                    <h1><Sidebar /></h1>
                </div>
                <div className='col-12 col-md-10'>

                    <div className="row d-flex justify-content-around">
                        <div className="col-12 col-lg-8 mt-5 order-details">

                            <h1 className="my-5">Order ID: {id}</h1>

                            <h4 className="mb-4">Shipping Info</h4>
                            <p><b>Name:</b>{user.name}</p>
                            <p><b>Phone:</b>{shippingInfo.phoneNo}</p>
                            <p className="mb-4"><b>Address:</b>{shippingInfo.address},{shippingInfo.city},{shippingInfo.postalCode},{shippingInfo.country}</p>
                            <p><b>Amount:</b> ${totalPrice}</p>

                            <hr />

                            <h4 className="my-4">Payment</h4>
                            <p className={isPaid ? 'greenColor' : 'redColor'} ><b>{isPaid ? 'Paid' : 'Not Paid'}</b></p>


                            <h4 className="my-4">Order Status:</h4>
                            <p className={orderStatus && orderStatus.includes('Delivered') ? 'greenColor' : 'orange'} ><b>{orderStatus}</b></p>


                            <h4 className="my-4">Order Items:</h4>

                            <hr />
                            <div className="cart-item my-1">
                                {
                                    orderItems && orderItems.map((item) => (
                                        <div className="row my-5">
                                            <div className="col-4 col-lg-2">
                                                <img src={item.image} alt={item.name} height="45" width="65" />
                                            </div>

                                            <div className="col-5 col-lg-5">
                                                <Link to={`/product/${item.product}`}>{item.name}</Link>
                                            </div>


                                            <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                                                <p>$ {item.price}</p>
                                            </div>

                                            <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                                                <p>{item.quantity} Item(s)</p>
                                            </div>
                                        </div>
                                    ))
                                }

                            </div>
                            <hr />
                        </div>
                        <div className="col-12 col-lg-3 mt-5">
                          <h4 className="my-4">Order Status</h4>
                          <div className="form-group">
                            <select 
                                className='form-control'
                                onChange={e =>setOrderStatus(e.target.value)}
                                value={orderStatus}
                                name='status'>
                                    <option value="Processing">Processing</option>
                                    <option value="Shipping">Shipping</option>
                                    <option value="Delivered">Delivered</option>
                                </select>
                                
                          </div>
                          <button disabled={loading} onClick={submitHandler} className="btn btn-primary btn-block">Update Status</button>
                        </div>
                    </div>
                </div>

            </div>

        </Fragment>
    )
}
