import { useEffect, useState } from "react"
import { clearAuthError, forgotPassword } from "../../actions/userActions";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";



export const ForgotPassword = () => {
    const[email,setEmail]=useState('');
    const{error,message}=useSelector(state=>state.authState)
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const submitHandler=(e)=>{
        e.preventDefault();
        const formData=new FormData();
        formData.append('email',email);
        dispatch(forgotPassword(formData));
              
    }
    useEffect(()=>{
        if(message){
           toast.info(message,{
               position:'bottom-center'
           })
           setEmail('');
           return;
        }
        if(error){
            toast(error,{
                type:'error',
                onOpen:()=>{dispatch(clearAuthError)}
            })
            return;
        }
    },[error,message,dispatch,navigate])

  return (
    <div className="container container-fluid">
    <div className="row wrapper">
            <div className="col-10 col-lg-5">
                <form className="shadow-lg" onSubmit={submitHandler}>
                    <h1 className="mb-3">Forgot Password</h1>
                    <div className="form-group">
                        <label htmlFor="email_field">Enter Email</label>
                        <input
                            type="email"
                            id="email_field"
                            className="form-control"
                            onChange={(e)=>setEmail(e.target.value)}
                            value={email}
                        />
                    </div>

                    <button
                        id="forgot_password_button"
                        type="submit"
                        className="btn btn-block py-3">
                        Send Email
                </button>

                </form>
            </div>
        </div>
    
</div>
  )
}
