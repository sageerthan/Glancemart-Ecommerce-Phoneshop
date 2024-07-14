import { Fragment, useEffect, useState } from "react";
import { getAdminProducts } from "../../actions/productAction";
import { Sidebar } from "./Sidebar";
import { useDispatch, useSelector} from 'react-redux';
import { MetaData } from "../layouts/MetaData";
import { adminOrders as adminOrdersAction } from "../../actions/orderActions";
import { getUsers } from "../../actions/userActions";
import { Link } from "react-router-dom";
export const Dashboard = () => {
  const {products=[]}=useSelector(state=>state.productsState);
  const {adminOrders=[]}=useSelector(state=>state.orderState);
  const {users=[]}=useSelector(state=>state.userState);
  const dispatch=useDispatch();
  
  let outofstock=0;
  if(products.length>0){
    products.forEach(product=>{
      if(product.stock===0){
          outofstock+=1;
      }
    })
  }
  let totalAmount=0;
  if(adminOrders.length>0){
    adminOrders.forEach(order=>{
      totalAmount+=order.totalPrice
    })
  }
  useEffect(()=>{
        dispatch(getAdminProducts);
        dispatch(adminOrdersAction);
        dispatch(getUsers);
  },[dispatch])

  
  return (
    <Fragment>
      <MetaData title="Dashboard"/>
      <div className='row'>
      <div className="col-12 col-md-2">
        <h1><Sidebar /></h1>
      </div>
      <div className="col-12 col-md-10">
        <h1 className="my-4 text-center">Dashboard</h1>

        <div className="row pr-4">
          <div className="col-xl-12 col-sm-12 mb-3">
            <div className="card text-white bg-primary o-hidden h-100">
              <div className="card-body">
                <div className="text-center card-font-size">Total Amount <i class="fa fa-money"></i><br /> <b>${totalAmount}</b>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row pr-4">
          <div className="col-xl-3 col-sm-6 mb-3">
            <div className="card text-white bg-success o-hidden h-100">
              <div className="card-body">
                <div className="text-center card-font-size">Products <i class="fa fa-product-hunt"></i><br /> <b>{products.length}</b></div>
              </div>
              <Link className="card-footer text-white clearfix small z-1" to="/admin/products">
                <span className="float-left">View Details</span>
                <span className="float-right">
                  <i className="fa fa-angle-right"></i>
                </span>
              </Link>
            </div>
          </div>


          <div className="col-xl-3 col-sm-6 mb-3">
            <div className="card text-white bg-warning o-hidden h-100">
              <div className="card-body">
                <div className="text-center card-font-size">Orders <i class="fa fa-shopping-bag" aria-hidden="true"></i><br /> <b>{adminOrders.length}</b></div>
              </div>
              <Link className="card-footer text-white clearfix small z-1" to="/admin/orders">
                <span className="float-left">View Details</span>
                <span className="float-right">
                  <i className="fa fa-angle-right"></i>
                </span>
              </Link>
            </div>
          </div>


          <div className="col-xl-3 col-sm-6 mb-3">
            <div className="card text-white bg-info o-hidden h-100">
              <div className="card-body">
                <div className="text-center card-font-size">Users <i class="fa fa-users" ></i><br /> <b>{users.length}</b></div>
              </div>
              <Link className="card-footer text-white clearfix small z-1" to="/admin/users">
                <span className="float-left">View Details</span>
                <span className="float-right">
                  <i className="fa fa-angle-right"></i>
                </span>
              </Link>
            </div>
          </div>


          <div className="col-xl-3 col-sm-6 mb-3">
            <div className="card text-white bg-danger o-hidden h-100">
              <div className="card-body">
                <div className="text-center card-font-size">Out of Stock <i class="fa fa-thumbs-o-down" aria-hidden="true"></i><br /> <b>{outofstock}</b></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </Fragment>
    
  )
}

