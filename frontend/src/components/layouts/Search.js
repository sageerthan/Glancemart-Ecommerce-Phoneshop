import React, { useEffect, useState } from 'react'
import {useLocation, useNavigate} from 'react-router-dom';
export const Search = () => {
    const navigate=useNavigate();
    const[keyword,setKeyword]=useState('');
    const location =useLocation();

    const changeHandler =(e)=>{
         e.preventDefault();
         navigate(`/search/${keyword}`);    
    }
    const clearKeyword=()=>{
      setKeyword('');
    }
    useEffect(()=>{
      if(location.pathname==='/'){
        clearKeyword();
      }
    },[location])
  return (
    
    <form onSubmit={changeHandler}>
        <div className="input-group">
          <input
            type="text"
            id="search_field"
            className="form-control"
            placeholder="Enter Product Name ..."
            value={keyword}
            onChange={e=>setKeyword(e.target.value)}
          />
          <div className="input-group-append">
            <button id="search_btn" className="btn">
              <i className="fa fa-search" aria-hidden="true"></i>
            </button>
          </div>
        </div>
    </form>
    
  )
}
