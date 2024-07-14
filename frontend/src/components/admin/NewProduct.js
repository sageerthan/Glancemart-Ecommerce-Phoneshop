import { MetaData } from "../layouts/MetaData";
import { Fragment, useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createNewProduct } from "../../actions/productAction";
import { clearError, clearProductCreated } from "../../slices/productSlice";
import {toast} from 'react-toastify';
export const NewProduct = () => {
    const[name,setName]=useState('');
    const[price,setPrice]=useState('');
    const[description,setDescription]=useState('');
    const[category,setCategory]=useState('');
    const[stock,setStock]=useState(0);
    const[seller,setSeller]=useState('');
    const[images,setImages]=useState([]);
    const[imagesPreview,setImagesPreview]=useState([]);

    const{loading,isProductCreated,error}=useSelector(state=>state.productState);

    const categories=[
        "Mobile Phones",
        "Laptops",
        "Headphones",
        "Accessories",
        "Airpods"
    ];

    const navigate=useNavigate();
    const dispatch=useDispatch();

    const onImagesChange=(e)=>{
        const files=Array.from(e.target.files);
        files.forEach(file =>{
            const reader = new FileReader();
            reader.onload=()=>{
                if(reader.readyState ==2){
                    setImagesPreview(oldArray=>[...oldArray,reader.result])
                    setImages(oldArray=>[...oldArray,file])
                }
            }
           reader.readAsDataURL(file)    
        })
    }

    const submitHandler =(e)=>{
        e.preventDefault();
        const formData=new FormData();
        formData.append('name',name);
        formData.append('price',price);
        formData.append('description',description);
        formData.append('category',category);
        formData.append('stock',stock);
        formData.append('seller',seller);
        images.forEach(image=>{
            formData.append('images',image)
        })
        dispatch(createNewProduct(formData))

    }
    useEffect(()=>{

        if(isProductCreated){
            toast('Product created successfully!',{
                type:'success',
                onOpen:()=>{dispatch(clearProductCreated())}
            })
            navigate('/admin/products');
            return
        }
        if(error){
            toast(error,{
                type:'error',
                onOpen:()=>{dispatch(clearError())}
            })
            return;
        }
    },[isProductCreated,error,dispatch])

    return (
        <Fragment>
            <MetaData title="New Product" />
            <div className='row'>
                <div className="col-12 col-md-2">
                    <h1><Sidebar /></h1>
                </div>
                <div className="container container-fluid">
                    <div className="wrapper my-5">
                        <form className="shadow-lg" encType='multipart/form-data' onSubmit={submitHandler}>
                            <h1 className="mb-4 text-center">New Product</h1>

                            <div className="form-group">
                                <label htmlFor="name_field">Name</label>
                                <input
                                    type="text"
                                    id="name_field"
                                    className="form-control"
                                    value={name}
                                    onChange={e=>setName(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="price_field">Price</label>
                                <input
                                    type="text"
                                    id="price_field"
                                    className="form-control"
                                    value={price}
                                    onChange={e=>setPrice(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="description_field">Description</label>
                                <textarea 
                                        className="form-control"
                                        id="description_field"
                                        rows="8"
                                        value={description}
                                        onChange={e=>setDescription(e.target.value)} ></textarea>
                            </div>

                            <div className="form-group">
                                <label htmlFor="category_field">Category</label>
                                <select  onChange={e=>setCategory(e.target.value)} className="form-control" id="category_field">
                                    <option value=''>Select</option>
                                    {
                                        categories.map(category=>(
                                            <option key={category} value={category}>{category}</option>
                                        ))
                                    }
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="stock_field">Stock</label>
                                <input
                                    type="number"
                                    id="stock_field"
                                    className="form-control"
                                    value={stock}
                                    onChange={e=>setStock(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="seller_field">Seller Name</label>
                                <input
                                    type="text"
                                    id="seller_field"
                                    className="form-control"
                                    value={seller}
                                    onChange={e=>setSeller(e.target.value)}
                                />
                            </div>

                            <div className='form-group'>
                                <label>Images</label>

                                <div className='custom-file'>
                                    <input
                                        type='file'
                                        name='product_images'
                                        className='custom-file-input'
                                        id='customFile'
                                        multiple
                                        onChange={onImagesChange}
                                    />
                                    <label className='custom-file-label' htmlFor='customFile'>
                                        Choose Images
                                    </label>
                                </div>
                                {imagesPreview.map(image =>(
                                    <img
                                       className="mt-3 mr-2"
                                       key={image}
                                       src={image}
                                       alt='Image Preview'
                                       width='55'
                                       height='52'
                                    />
                                ))

                                }
                            </div>


                            <button
                                id="login_button"
                                type="submit"
                                disabled={loading}
                                className="btn btn-block py-3"
                            >
                                CREATE
                            </button>

                        </form>
                    </div>
                </div>
            </div>

        </Fragment>
    )
}
