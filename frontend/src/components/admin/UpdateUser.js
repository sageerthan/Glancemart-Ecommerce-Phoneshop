import { MetaData } from "../layouts/MetaData";
import { Fragment, useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
import {  useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {toast} from 'react-toastify';
import { getUser, updateUser } from "../../actions/userActions";
import { clearUserUpdated,clearError } from "../../slices/userSlice";

export const UpdateUser= () => {
    const [role,setRole]=useState('');
    const {id}=useParams();
    const{loading,isUserUpdated,error,user={}}=useSelector(state=>state.userState);
    const {  user:authUser } = useSelector( state => state.authState)

    const dispatch=useDispatch();
    
    const submitHandler =(e)=>{
        e.preventDefault();
        const formData=new FormData();
        formData.append('role',role);
        dispatch(updateUser(id,formData));
    }
   
    useEffect(()=>{
        if(isUserUpdated){
            toast('User updated successfully!',{
                type:'success',
                onOpen:()=>{dispatch(clearUserUpdated())}
            })
            return;
        }
        if(error){
            toast(error,{
                type:'error',
                onOpen:()=>{dispatch(clearError())}
            })
            return;
        }
        dispatch(getUser(id))
    },[isUserUpdated,error,dispatch])

    useEffect(()=>{
        if(user._id){
           setRole(user.role);
        }
    },[user])

    return (
        <Fragment>
            <MetaData title="Update User" />
            <div className='row'>
                <div className="col-12 col-md-2">
                    <h1><Sidebar /></h1>
                </div>
                <div className="container container-fluid">
                    <div className="wrapper my-5">
                        <form className="shadow-lg" onSubmit={submitHandler}>
                            <h1 className="mb-4 text-center">Update User</h1>

                            <div className="form-group">
                                <label htmlFor="name_field">Name</label>
                                <input
                                    type="text"
                                    id="name_field"
                                    className="form-control"
                                    value={user.name}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email_field">Email</label>
                                <input
                                    type="text"
                                    id="email_field"
                                    className="form-control"
                                    value={user.email}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="role_field">Role</label>
                                <select disabled={user._id === authUser._id } value={role} onChange={e=>setRole(e.target.value)} className="form-control" id='role_field'>
                                    <option value='admin'>admin</option>
                                    <option value='user'>user</option>
                                </select>
                            </div>
                            <button
                                id="login_button"
                                type="submit"
                                disabled={loading}
                                className="btn btn-block py-3"
                            >
                                UPDATE
                            </button>

                        </form>
                    </div>
                </div>
            </div>

        </Fragment>
    )
}
