import { useDispatch, useSelector } from "react-redux";
import { clearError } from "../../slices/productsSlice";
import { deleteExistProduct, getAdminProducts } from "../../actions/productAction";
import { Fragment, useEffect } from "react";
import { MetaData } from "../layouts/MetaData";
import {Loader} from '../layouts/Loader';
import { MDBDataTable } from "mdbreact";
import { Link } from "react-router-dom";
import { toast} from "react-toastify";
import { Sidebar } from "./Sidebar";
import { Button } from "react-bootstrap";
import { clearProductDeleted } from "../../slices/productSlice";
export const ProductList = () => {
    //loading-true
    const{products=[],loading,error}=useSelector(state=>state.productsState);
    const{isProductDeleted,error:productError}=useSelector(state=>state.productState);
    const dispatch=useDispatch();
    const setProducts=()=>{
        const data={
            columns:[
                {
                    label:'ID',
                    field:'id',
                    sort:'asc'
                },
                {
                    label:'Name',
                    field:'name',
                    sort:'asc'
                },
                {
                    label:'Price',
                    field:'price',
                    sort:'asc'
                },
                {
                    label:'Stock',
                    field:'stock',
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

       products.forEach((product)=>{
        data.rows.push({
            id:product._id,
            name:product.name,
            price:`$${product.price}`,
            stock:product.stock,
            action:(
                <Fragment>
                    <Link to={`/admin/product/${product._id}`} className='btn btn-primary'>Edit <i class="fa fa-pencil-square-o"></i></Link>
                    <Button onClick={(e)=>deleteHandler(e,product._id)} className='btn btn-danger py-1 px-2 ml-2'>Delete <i class="fa fa-trash"></i></Button>
                </Fragment>
            )
        })
       }) 
       return data;
    }

    const deleteHandler=(e,id)=>{
         e.target.disabled=true;
         dispatch(deleteExistProduct(id))
    }
    useEffect(()=>{
        if(error){
            toast(error,{
                type:error,
                onOpen:()=>{dispatch(clearError())}
            })
            return;
        }
        if(isProductDeleted){
            toast('Product deleted successfully',{
                type:'success',
                onOpen:()=>dispatch(clearProductDeleted())
            })
            return;
        }
        if(productError){
            toast(error,{
                type:error,
                onOpen:()=>{dispatch(clearError())}
            })
            return;
        }
        dispatch(getAdminProducts)
    },[error,dispatch,isProductDeleted,productError])


  return (
    <Fragment>
        <MetaData title='All products'/>
      <div className='row'>
      <div className="col-12 col-md-2">
        <h1><Sidebar /></h1>
      </div>
      <div className="col-12 col-md-10">
        <h1 className="my-4 text-center">Product List</h1>
           <Fragment>
            {loading?<Loader/>:
            <MDBDataTable
            className="px-3"
            bordered
            striped
            hover
            data={setProducts()}/>}         
           </Fragment>
      </div>
    </div>
    </Fragment>
   
  )
}
