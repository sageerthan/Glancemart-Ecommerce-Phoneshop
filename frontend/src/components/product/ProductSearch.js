import React, { Fragment, useEffect, useState } from 'react'
import { MetaData } from '../layouts/MetaData'
import { getProducts } from '../../actions/productAction'
import { useDispatch, useSelector } from 'react-redux';
import { Loader } from '../layouts/Loader';
import { Product } from './Product';
import { toast } from 'react-toastify';
import Pagination from 'react-js-pagination';
import { useParams } from 'react-router-dom';
export const ProductSearch= () => {
  const dispatch = useDispatch();
  const { products, loading,productsCount,resPerPage,error } = useSelector((state) => state.productsState)
  const [currentPage,setCurrentPage]=useState(1);
  const [category,setCategory]=useState(null);
  const {keyword}=useParams();
  const categories= [
    "Mobile Phones",
    "Laptops",
    "Headphones",
    "Accessories",
    "Airpods"
];


  const setCurrentPageNo=(pageNo)=>{
        setCurrentPage(pageNo);
  }
  
  useEffect(() => {
    if(error){
      return toast.error(error)
    }
    dispatch(getProducts(currentPage,keyword,category))
  }, [error,dispatch,currentPage,keyword,category])
  return (
    <Fragment>
      {
      loading?<Loader/>:
         products && <Fragment>
      <MetaData title="Search Products" />
      <h1 id="products_heading">Latest Products</h1>

      <section id="products" className="container mt-5">
        <div className="row">
          <div className="col-6 col-md-3 mb-5 mt-5">
            <div className='px-5'>
                <h3>Categories</h3>
                <ul className='pl-0'>
                  {
                    categories.map(category=>(
                      <li style={{
                        cursor:'pointer',
                        listStyleType:'none'
                       }} key={category} onClick={()=>{setCategory(category)}}>{category}</li>
                    ))
                  }
                </ul>
            </div>
          </div>
          <div className="col-6 col-md-9">
            <div className='row'>
            {
            products && products.map((product) => (
              <Product col='4' key={product._id} product={product}/>
            ))
            }
            </div>
          </div>
          

        </div>
      </section>
      {productsCount>0 && productsCount>resPerPage?
      <div className='d-flex justify-content-center'>
        <Pagination
             activePage={currentPage}
             onChange={setCurrentPageNo}
             totalItemsCount={productsCount}
             itemsCountPerPage={resPerPage}
             nextPageText={'Next'}
             firstPageText={'First'}
             lastPageText={'Last'}
             itemClass={'page-item'}
             linkClass={'page-link'}


        />
      </div>:null}

          </Fragment>  
      }
          
    </Fragment>
   
  )
}
