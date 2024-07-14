const express=require('express');
const { isAuthenticatedUser, isAuthorizedRoles } = require('../middlewares/authenticate');
const { newOrder, getSingleOrder, myOrders, orders, updateOrder, deleteOrder } = require('../controllers/orderController');
const router=express.Router();

router.route('/order/new').post(isAuthenticatedUser,newOrder);
router.route('/order/:id').get(isAuthenticatedUser,getSingleOrder);
router.route('/myorders').get(isAuthenticatedUser,myOrders);

//Admin routes
router.route('/admin/orders').get(isAuthenticatedUser,isAuthorizedRoles('admin'),orders);
router.route('/admin/order/:id').put(isAuthenticatedUser,isAuthorizedRoles('admin'),updateOrder)
                                .delete(isAuthenticatedUser,isAuthorizedRoles('admin'),deleteOrder);
module.exports=router;