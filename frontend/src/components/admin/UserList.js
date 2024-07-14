import { useDispatch, useSelector } from "react-redux";
import { clearUserDeleted, clearError } from "../../slices/userSlice";
import { Fragment, useEffect } from "react";
import { MetaData } from "../layouts/MetaData";
import {Loader} from '../layouts/Loader';
import { MDBDataTable } from "mdbreact";
import { Link } from "react-router-dom";
import { toast} from "react-toastify";
import { Sidebar } from "./Sidebar";
import { Button } from "react-bootstrap";
import { deleteUser, getUsers } from "../../actions/userActions";
import { Image } from 'react-bootstrap';
export const UserList = () => {
    
    const{users=[],loading,error,isUserDeleted}=useSelector(state=>state.userState);
    const dispatch=useDispatch();
    const setUsers=()=>{
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
                    label:'Email',
                    field:'email',
                    sort:'asc'
                },
                {
                    label:'Avatar',
                    field:'avatar',
                    sort:'asc'
                },
                {
                    label:'Role',
                    field:'role',

                },
                {
                    label:'Action',
                    field:'action',
                    sort:'asc'
                }
            ],
            rows:[]
        }

       users.forEach((user)=>{
        data.rows.push({
            id:user._id,
            name:user.name,
            email:user.email,
            avatar:<Image className='rounded-circle' src={user.avatar??'/images/avatar.jpeg'} style={{ width: '50px', height: '50px' }}/>,
            role:user.role,
            action:(
                <Fragment>
                    <Link to={`/admin/user/${user._id}`} className='btn btn-primary'>Edit <i class="fa fa-pencil-square-o"></i></Link>
                    <Button onClick={(e)=>deleteHandler(e,user._id)} className='btn btn-danger py-1 px-2 ml-2'>Delete <i class="fa fa-trash"></i></Button>
                </Fragment>
            )
        })
       }) 
       return data;
    }

    const deleteHandler=(e,id)=>{
         e.target.disabled=true;
         dispatch(deleteUser(id))
    }
    useEffect(()=>{
        if(error){
            toast(error,{
                type:error,
                onOpen:()=>{dispatch(clearError())}
            })
            return;
        }
        if(isUserDeleted){
            toast('User deleted successfully',{
                type:'success',
                onOpen:()=>dispatch(clearUserDeleted())
            })
            return;
        }
       
        dispatch(getUsers)
    },[error,dispatch,isUserDeleted])


  return (
    <Fragment>
        <MetaData title='All users'/>
      <div className='row justify-content-center'>
      <div className="col-12 col-md-2">
        <h1><Sidebar /></h1>
      </div>
      <div className="col-12 col-md-10">
        <h1 className="my-4 text-center">User List</h1>
           <Fragment>
            {loading?<Loader/>:
            <MDBDataTable
            className=" px-3"
            bordered
            striped
            hover
            data={setUsers()}/>}         
           </Fragment>
      </div>
    </div>
    </Fragment>
   
  )
}
