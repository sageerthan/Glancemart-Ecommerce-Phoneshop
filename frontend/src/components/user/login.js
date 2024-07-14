import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { clearAuthError, login } from '../../actions/userActions';
import { MetaData } from '../layouts/MetaData';
import {toast} from 'react-toastify';
import {Link,useLocation,useNavigate} from 'react-router-dom'
export const Login = () => {
    const[email,setEmail]=useState('');
    const[password,setPassword]=useState('');
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const {loading,error,isAuthenticated}=useSelector(state=>state.authState)
    const location=useLocation();

    const redirect=location.search?'/'+location.search.split('=')[1]:'/';

    const submitHandler=(e)=>{
        e.preventDefault();
        dispatch(login(email,password))  
    }

    useEffect(()=>{
        if(isAuthenticated){
           navigate(redirect);
          
        }
        if(error){
            toast(error,{
                  type:'error',
                  position:'bottom-center',
                  onOpen:()=>{dispatch(clearAuthError)}
            });
            return;       
        }
    },[error,isAuthenticated,redirect,navigate,dispatch])
    return (
        <Fragment>
            <MetaData title={'Login'}/>
        <div className="container container-fluid">
            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form className="shadow-lg" onSubmit={submitHandler}>
                        <h1 className="mb-3">Login</h1>
                        <div className="form-group">
                            <label htmlFor="email_field">Email</label>
                            <input
                                type="email"
                                id="email_field"
                                className="form-control"
                                value={email}
                                onChange={(e)=>setEmail(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password_field">Password</label>
                            <input
                                type="password"
                                id="password_field"
                                className="form-control"
                                value={password}
                                onChange={(e)=>setPassword(e.target.value)}
                            />
                        </div>

                        <Link to="/forgotpassword" className="float-right mb-4">Forgot Password?</Link>

                        <button
                            id="login_button"
                            type="submit"
                            className="btn btn-block py-3"
                            disabled={loading}
                        >
                            LOGIN
                        </button>

                        <Link to="/register" className="float-right mt-3">New User?</Link>
                    </form>
                </div>
            </div>
        </div>
        </Fragment>
    )
}
