import { useDispatch, useSelector } from "react-redux";
import { clearReviewDeleted, clearError } from "../../slices/productSlice";
import { Fragment, useEffect, useState } from "react";
import { MetaData } from "../layouts/MetaData";
import {Loader} from '../layouts/Loader';
import { MDBDataTable } from "mdbreact";
import { toast} from "react-toastify";
import { Sidebar } from "./Sidebar";
import { Button } from "react-bootstrap";
import { deleteReview, getReviews } from "../../actions/productAction";

export const ReviewList = () => {
    
    const{reviews=[],loading,error,isReviewDeleted}=useSelector(state=>state.productState);
    const[productId,setProductId]=useState('');
    const dispatch=useDispatch();
    const setReviews=()=>{
        const data={
            columns:[
                {
                    label:'ID',
                    field:'id',
                    sort:'asc'
                },
                {
                    label:'Rating',
                    field:'rating',
                    sort:'asc'
                },
                {
                    label:'User',
                    field:'user',
                    sort:'asc'
                },
                {
                    label:'Comment',
                    field:'comment',
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

       reviews.forEach((review)=>{
        data.rows.push({
            id:review._id,
            rating:review.rating,
            user:review.user.name,
            comment:review.comment,
            action:(
                <Fragment>
                    <Button onClick={(e)=>deleteHandler(e,review._id)} className='btn btn-danger py-1 px-2 ml-2'>Delete <i class="fa fa-trash"></i></Button>
                </Fragment>
            )
        })
       }) 
       return data;
    }
    const submitHandler=(e)=>{
        e.preventDefault();
        dispatch(getReviews(productId))
    }

    const deleteHandler=(e,id)=>{
         e.target.disabled=true;
         dispatch(deleteReview(productId,id))
    }
    useEffect(()=>{
        if(error){
            toast(error,{
                type:error,
                onOpen:()=>{dispatch(clearError())}
            })
            return;
        }
        if(isReviewDeleted){
            toast('Review deleted successfully',{
                type:'success',
                onOpen:()=>dispatch(clearReviewDeleted())
            })  
            dispatch(getReviews(productId))       
            return;
        }
    },[error,dispatch,isReviewDeleted])


  return (
    <Fragment>
        <MetaData title='All Reviews'/>
      <div className='row justify-content-center'>
      <div className="col-12 col-md-2">
        <h1><Sidebar /></h1>
      </div>
      <div className="col-12 col-md-10">
        <h1 className="my-4 text-center">Reviews List</h1>
        <div className="row justify-content-center mt-5">
            <div className='col-5'>
                <form onSubmit={submitHandler}>
                    <div className="form-group">
                        <label>Product ID</label>
                        <input 
                        type="text"
                        value={productId}
                        onChange={e=>setProductId(e.target.value)}
                        className="form-control"/>
                    </div>
                    <button type='submit' disabled={loading} className="btn btn-primary btn-block py-2">
                        Search
                    </button>
                </form>
            </div>
        </div>
           <Fragment>
            {loading?<Loader/>:
            <MDBDataTable
            className=" px-3"
            bordered
            striped
            hover
            data={setReviews()}/>}         
           </Fragment>
      </div>
    </div>
    </Fragment>
   
  )
}
