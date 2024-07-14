import { useDispatch, useSelector } from "react-redux";
import { clearAuthError, updatePassword as updatePasswordAction } from "../../actions/userActions";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const UpdatePassword = () => {
    const[oldPassword,setOldPassword]=useState('');
    const[newPassword,setNewPassword]=useState('');
    const dispatch=useDispatch();
    const{isUpdated,error}=useSelector(state=>state.authState)

    const submitHandler=(e)=>{
        e.preventDefault()
        const formdata =new FormData();
        formdata.append('oldPassword',oldPassword);
        formdata.append('password',newPassword);

        dispatch(updatePasswordAction(formdata));
    }
    useEffect(()=>{
        if(isUpdated){
            
            toast('Password updated successfully',{
                type:'success'  
            })
            setOldPassword('');
            setNewPassword('');
            return;
        }
        if(error){
            toast(error,{
                type:'error',
                onOpen:()=>{dispatch(clearAuthError)}
            })
            return;
        }
    },[error,isUpdated,dispatch])

  return (
    <div className="container-container-fluid">
		<div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form className="shadow-lg" onSubmit={submitHandler}>
                        <h1 className="mt-2 mb-5">Update Password</h1>
                        <div className="form-group">
                            <label htmlFor="old_password_field">Old Password</label>
                            <input
                                type="password"
                                id="old_password_field"
                                className="form-control"
                                onChange={(e)=>setOldPassword(e.target.value)}
                                value={oldPassword}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="new_password_field">New Password</label>
                            <input
                                type="password"
                                id="new_password_field"
                                className="form-control"
                                onChange={(e)=>setNewPassword(e.target.value)}
                                value={newPassword}
                            />
                        </div>

                        <button type="submit" className="btn update-btn btn-block mt-4 mb-3">Update Password</button>
                    </form>
                </div>
            </div>
        
    </div>
  )
}
