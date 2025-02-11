import React, { Fragment, useEffect, useState } from 'react'
import { MetaData } from './layouts/MetaData'
import { getProducts } from '../actions/productAction'
import { useDispatch, useSelector } from 'react-redux';
import { Loader } from './layouts/Loader';
import { Product } from './product/Product';
import { toast } from 'react-toastify';
import Pagination from 'react-js-pagination';
export const Home = () => {
  const dispatch = useDispatch();
  const { products, loading,productsCount,resPerPage,error } = useSelector((state) => state.productsState)
  const [currentPage,setCurrentPage]=useState(1);

  const setCurrentPageNo=(pageNo)=>{
        setCurrentPage(pageNo);
  }
  
  useEffect(() => {
    if(error){
      return toast.error(error)
    }
    dispatch(getProducts(currentPage,null,null))
  }, [error,dispatch,currentPage])
  return (
    <Fragment>
      {
      loading?<Loader/>:
         products && <Fragment>
      <MetaData title="Best Products" />
      <h1 id="products_heading">Latest Products</h1>

      <section id="products" className="container mt-5">
        <div className="row">
          {
            products && products.map((product) => (
              <Product col={3} key={product._id} product={product}/>
            ))
          }

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
