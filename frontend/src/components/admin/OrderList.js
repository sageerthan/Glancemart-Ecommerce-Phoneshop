import { useDispatch, useSelector } from "react-redux";
import { clearOrderDeleted, clearOrderError } from "../../slices/orderSlice";
import { adminOrders as adminOrdersActions } from "../../actions/orderActions";
import { Fragment, useEffect } from "react";
import { MetaData } from "../layouts/MetaData";
import {Loader} from '../layouts/Loader';
import { MDBDataTable } from "mdbreact";
import { Link } from "react-router-dom";
import { toast} from "react-toastify";
import { Sidebar } from "./Sidebar";
import { Button } from "react-bootstrap";
import { deleteOrder } from "../../actions/orderActions";
export const OrderList = () => {
    
    const{adminOrders=[],loading,error,isOrderDeleted}=useSelector(state=>state.orderState);
    const dispatch=useDispatch();
    const setOrders=()=>{
        const data={
            columns:[
                {
                    label:'ID',
                    field:'id',
                    sort:'asc'
                },
                {
                    label:'Number Of Items',
                    field:'numOfItems',
                    sort:'asc'
                },
                {
                    label:'Amount',
                    field:'amount',
                    sort:'asc'
                },
                {
                    label:'Status',
                    field:'status',
                    sort:'asc'
                },
                {
                    label:'Action',
                    field:'action',
                    sort:'asc'
                }
            ],
            rows:[]
        }

       adminOrders.forEach((order)=>{
        data.rows.push({
            id:order._id,
            numOfItems:order.orderItems.length,
            amount:`$${order.totalPrice}`,
            status:<p style={{color:order.orderStatus ==='Processing'?'orange':'green'}}>{order.orderStatus}</p>,
            action:(
                <Fragment>
                    <Link to={`/admin/order/${order._id}`} className='btn btn-primary'>Edit <i class="fa fa-pencil-square-o"></i></Link>
                    <Button onClick={(e)=>deleteHandler(e,order._id)} className='btn btn-danger py-1 px-2 ml-2'>Delete <i class="fa fa-trash"></i></Button>
                </Fragment>
            )
        })
       }) 
       return data;
    }

    const deleteHandler=(e,id)=>{
         e.target.disabled=true;
         dispatch(deleteOrder(id))
    }
    useEffect(()=>{
        if(error){
            toast(error,{
                type:error,
                onOpen:()=>{dispatch(clearOrderError())}
            })
            return;
        }
        if(isOrderDeleted){
            toast('Product deleted successfully',{
                type:'success',
                onOpen:()=>dispatch(clearOrderDeleted())
            })
            return;
        }
       
        dispatch(adminOrdersActions)
    },[error,dispatch,isOrderDeleted])


  return (
    <Fragment>
        <MetaData title='All products'/>
      <div className='row'>
      <div className="col-12 col-md-2">
        <h1><Sidebar /></h1>
      </div>
      <div className="col-12 col-md-10">
        <h1 className="my-4 text-center">Order List</h1>
           <Fragment>
            {loading?<Loader/>:
            <MDBDataTable
            className="px-3"
            bordered
            striped
            hover
            data={setOrders()}/>}         
           </Fragment>
      </div>
    </div>
    </Fragment>
   
  )
}
