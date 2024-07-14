const express=require('express');
const { getProducts, newProduct, getSingleProduct, updateProduct, deleteProduct, createReview, getReviews, deleteReview, getAdminProducts } = require('../controllers/productController');
const router=express.Router();
const {isAuthenticatedUser, isAuthorizedRoles}=require('../middlewares/authenticate')
const multer=require('multer');
const path=require('path');

const upload=multer({storage:multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'..','uploads/product'))
    },
    filename:function(req,file,cb){
        cb(null,file.originalname)
    }
})})
router.route('/products').get(getProducts)

router.route('/products/:id').get(getSingleProduct);
                             
router.route('/review').put(isAuthenticatedUser,createReview)
                       

//Admin Route
router.route('/admin/products').get(isAuthenticatedUser,isAuthorizedRoles('admin'),getAdminProducts);
router.route('/admin/product/new').post(isAuthenticatedUser,isAuthorizedRoles('admin'),upload.array('images'),newProduct);
router.route('/admin/product/:id').delete(isAuthenticatedUser,isAuthorizedRoles('admin'),deleteProduct);
router.route('/admin/product/:id').put(isAuthenticatedUser,isAuthorizedRoles('admin'),upload.array('images'),updateProduct);
router.route('/admin/reviews').get(isAuthenticatedUser,isAuthorizedRoles('admin'),getReviews)
router.route('/admin/review').delete(isAuthenticatedUser,isAuthorizedRoles('admin'),deleteReview)
module.exports=router;