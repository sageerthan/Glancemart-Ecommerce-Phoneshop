const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("./catchAsyncError");
const jwt=require('jsonwebtoken');
const userModel=require('../Models/userModel');

exports.isAuthenticatedUser=catchAsyncError(async(req,res,next)=>{
    const{token}=req.cookies;
    if(!token){
       return next(new ErrorHandler('Login first to handle resourse',401));
    } 
    const decoded=jwt.verify(token,process.env.JWT_SECRET);
    req.user= await userModel.findById(decoded.id);
    next();
})

exports.isAuthorizedRoles=(...roles)=>{
   return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(`${req.user.role} Role is not allowed`,401));
        }
        next();
    }
}


