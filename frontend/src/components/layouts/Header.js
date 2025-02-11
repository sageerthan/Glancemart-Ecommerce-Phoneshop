import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search } from './Search';
import { useDispatch, useSelector } from 'react-redux';
import { Dropdown,Image } from 'react-bootstrap';
import { logout } from '../../actions/userActions';

export const Header = () => {
   const{isAuthenticated,user}=useSelector(state=>state.authState);
   const{items:cartItems}=useSelector(state=>state.cartState);
   const dispatch=useDispatch();
   const navigate=useNavigate();
   const logoutHandler=()=>{
      dispatch(logout);
   }
  return (
    <nav className="navbar row">
      <div className="col-12 col-md-3">
        <div className="navbar-brand">
          <Link to='/'>
          <img width="150px" src="/images/logo.png" alt="GlanceMart" />
          </Link>
        </div>
      </div>

      <div className="col-12 col-md-6 mt-2 mt-md-0">
        <Search/>
      </div>

      <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
        {isAuthenticated?
        <Dropdown className='d-inline'>
           <Dropdown.Toggle id='dropdown-basic' variant='default text-white pr-5'>
              <figure className='avatar avatar-nav'>
                <Image className='rounded-circle' src={user.avatar??'./images/avatar.jpeg'}/>
               
              </figure>
              <span>{user.name}</span>
           </Dropdown.Toggle>
           <Dropdown.Menu>
              {user.role==='admin'&& <Dropdown.Item onClick={()=>{navigate('/admin/dashboard')}} className='text-dark'>Dashboard</Dropdown.Item>}
              <Dropdown.Item onClick={()=>{navigate('/myprofile')}} className='text-dark'>Profile</Dropdown.Item>
              <Dropdown.Item onClick={()=>{navigate('/orders')}} className='text-dark'>Orders</Dropdown.Item>
              <Dropdown.Item className='text-danger' onClick={logoutHandler}>Logout</Dropdown.Item>
           </Dropdown.Menu>
        </Dropdown>:
        <Link to='/login' className="btn" id="login_btn">
         Login
        </Link>
        }
        <Link to='/cart'>
        <span id="cart" className="ml-3">Cart</span>
        <span className="ml-1" id="cart_count">{cartItems.length}</span>
        </Link>
      </div>
    </nav>
  )
}
