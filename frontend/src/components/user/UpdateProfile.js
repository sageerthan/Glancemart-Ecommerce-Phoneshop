import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { clearAuthError, clearUpdate, updateProfile } from '../../actions/userActions';
import { toast } from 'react-toastify';



export const UpdateProfile = () => {
   
    const {user,error,isUpdated}=useSelector(state=>state.authState);
    const[name,setName]=useState('');
    const[email,setEmail]=useState('')
    const[avatar,setAvatar]=useState('');
    const[avatarPreview,setAvatarPreview]=useState('./images/avatar.jpeg');
    const dispatch=useDispatch();
    

    const changeHandler=(e)=>{
            const reader=new FileReader();
            reader.readAsDataURL(e.target.files[0]);
            reader.onload=()=>{
               if(reader.readyState ===2){
                setAvatarPreview(reader.result);
                setAvatar(e.target.files[0]);
               } 
            }
    }

    const submitHandler=(e)=>{
        e.preventDefault();
        const formdata=new FormData();
        formdata.append('name',name);
        formdata.append('email',email);
        formdata.append('avatar',avatar);

       dispatch(updateProfile(formdata));
    }
    useEffect(()=>{
        if (user) {
            setName(user.name);
            setEmail(user.email);
            if(user.avatar) {
                setAvatarPreview(user.avatar)
            }
        }
    
        if(isUpdated){
            toast('Profile updated successfully',{
                type:'success',
                onOpen:()=>{dispatch(clearUpdate)}
            })
            return;
        }
        if(error){
            toast(error,{
                type:'error',
                onOpen:()=>{dispatch(clearAuthError)}
            })
            return;
        }
    },[error,isUpdated,dispatch,user])
  return (
  
    <div className="container-container-fluid">
    <div className="row wrapper">
             <div className="col-10 col-lg-5">
                 <form className="shadow-lg" encType='multipart/form-data' onSubmit={submitHandler}>
                     <h1 className="mt-2 mb-5">Update Profile</h1>

                     <div className="form-group">
                         <label htmlFor="name_field">Name</label>
                         <input 
                             type="text" 
                             id="name_field" 
                             className="form-control"
                             name='name'
                             onChange={e=>setName(e.target.value)}
                             value={name}
                         />
                     </div>

                     <div className="form-group">
                         <label htmlFor="email_field">Email</label>
                         <input
                             type="email"
                             id="email_field"
                             className="form-control"
                             name='email'
                             onChange={e=>setEmail(e.target.value)}
                             value={email}
                         />
                     </div>

                     <div className='form-group'>
                         <label htmlFor='avatar_upload'>Avatar</label>
                         <div className='d-flex align-items-center'>
                             <div>
                                 <figure className='avatar mr-3 item-rtl'>
                                     <img
                                         src={avatarPreview}
                                         className='rounded-circle'
                                         alt='Avatar Preview'
                                     />
                                 </figure>
                             </div>
                             <div className='custom-file'>
                                 <input
                                     type='file'
                                     name='avatar'
                                     className='custom-file-input'
                                     onChange={changeHandler}
                                     id='customFile'
                                 />
                                 <label className='custom-file-label' htmlFor='customFile'>
                                     Choose Avatar
                             </label>
                             </div>
                         </div>
                     </div>

                     <button type="submit" className="btn update-btn btn-block mt-4 mb-3" >Update</button>
                 </form>
             </div>
         </div>
     
   </div>
 
  )
}
