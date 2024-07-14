import { useEffect, useState } from "react";
import { clearAuthError, resetPassword as resetPasswordAction } from "../../actions/userActions";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export const ResetPassword = () => {
    const[password,setPassword]=useState('');
    const[confirmPassword,setConfirmPassword]=useState('');
    const{error,isAuthenticated}=useSelector(state=>state.authState);
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const{token}=useParams();

    const submitHandler=(e)=>{
        e.preventDefault();
        const formData=new FormData();
        formData.append('password',password);
        formData.append('confirmPassword',confirmPassword);
        dispatch(resetPasswordAction(formData,token));      
    }
    useEffect(()=>{
        if(isAuthenticated){
            toast("Password reset success",{
               type:'success' 
            })
            navigate('/');
            return;
        }
         if(error){
            toast(error,{
                type:'error',
                onOpen:()=>{dispatch(clearAuthError)}
            })
         }
    },[error,isAuthenticated,dispatch,navigate])
  return (
    <div className="container-container-fluid">
    <div className="row wrapper">
        <div className="col-10 col-lg-5">
            <form className="shadow-lg" onSubmit={submitHandler}>
                <h1 className="mb-3">New Password</h1>

                <div className="form-group">
                    <label htmlFor="password_field">Password</label>
                    <input
                        type="password"
                        id="password_field"
                        className="form-control"
                        onChange={(e)=>setPassword(e.target.value)}
                        value={password}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="confirm_password_field">Confirm Password</label>
                    <input
                        type="password"
                        id="confirm_password_field"
                        className="form-control"
                        onChange={(e)=>setConfirmPassword(e.target.value)}
                        value={confirmPassword}
                    />
                </div>

                <button
                    id="new_password_button"
                    type="submit"
                    className="btn btn-block py-3">
                    Set Password
                </button>

            </form>
        </div>
    </div>
    
</div>
  )
}
