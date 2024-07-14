const catchAsyncError = require("../middlewares/catchAsyncError");
const userModel=require("../Models/userModel");
const sendEmail = require("../utils/email");
const ErrorHandler = require("../utils/errorHandler");
const crypto=require('crypto')

exports.registerUser=catchAsyncError(async(req,res,next)=>{
    const{name,email,password}=req.body;
    let avatar;
    if(req.file){
        avatar=`${process.env.BACKEND_URL}/uploads/user/${req.file.originalname}`
    }

    const user=await userModel.create({name,email,password,avatar});

    const token=user.getJwtToken();

    //setting cookies
    const options={
        expires:new Date(Date.now()+process.env.COOKIE_EXPIRES_TIME*24*60*60*1000),
        httpOnly:true
    }
    res.status(201).cookie('token',token,options).json({
        success:true,
        token,
        user
    })
})

exports.loginUser=catchAsyncError(async(req,res,next)=>{
    const {email,password}=req.body;
    if(!email || !password){
        return next(new ErrorHandler('Please enter  email & password',400));
    }
    const user= await userModel.findOne({email}).select('+password');
    if(!user){
        return next(new ErrorHandler('Invalid email or password',401))
    }
    if(!await user.isValidPassword(password)){
        return next(new ErrorHandler('Invalid email or password',401))
    }

    const token=user.getJwtToken();
    const options={
        expires:new Date(Date.now()+process.env.COOKIE_EXPIRES_TIME*24*60*60*1000),
        httpOnly:true
    }
    res.status(201).cookie('token',token,options).json({
        success:true,
        token,
        user
    })
})

exports.logoutUser=(req,res,next)=>{
    res.cookie('token',null,{
          expires:new Date(Date.now()),
          httpOnly:true
    })
    res.status(200).json({
        success:true,
        message:"Logout"
    })
}
exports.forgotPassword=catchAsyncError(async(req,res,next)=>{

    const user =await userModel.findOne({email:req.body.email});
   
   if(!user){
    return next(new ErrorHandler('User not found with this email',404));
   }
   const resetToken=user.getResetToken();
   await user.save({validateBeforeSave:false});

   //Create reset url
   const resetUrl=`${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

   const message=`Your password reset url is as follows \n\n
                   ${resetUrl}\n\n If you have not requested this email,then ignore it.`

    try{
        await sendEmail({
            email:user.email,
            subject:"Glancemart password recovery",
            message
        })
        res.status(200).json({
            success:true,
            message:`Email sent to ${user.email}`
        })
    } 
    catch(error){
        user.resetPasswordToken=undefined;
        user.resetPasswordTokenExpire=undefined;
        await user.save({validateBeforeSave:false});
        return next(new ErrorHandler(error.message,500));
    }              
});

exports.resetPassword=catchAsyncError(async(req,res,next)=>{
       const resetPasswordToken=crypto.createHash('sha256').update(req.params.token).digest('hex');
       const user=await userModel.findOne({
        resetPasswordToken,
        resetPasswordTokenExpire:{
            $gt:Date.now()
        }
    })
    if(!user){
        return next(new ErrorHandler('Invalid token or token is expired',401));
    }
    if(req.body.password!=req.body.confirmPassword){
        return next(new ErrorHandler('Password doesnot match',401));
    }
    user.password=req.body.password;
    user.resetPasswordToken=undefined;
    user.resetPasswordTokenExpire=undefined;
    await user.save({validateBeforeSave:false})

    const token=user.getJwtToken();
    const options={
        expires:new Date(Date.now()+process.env.COOKIE_EXPIRES_TIME*24*60*60*1000),
        httpOnly:true
    }
    res.status(201).cookie('token',token,options).json({
        success:true,
        token,
        user
    })
})

//Get User Profile
exports.getUserProfile=catchAsyncError(async(req,res,next)=>{
    const user=await userModel.findById(req.user.id);
    res.status(200).json({
        success:true,
        user
    })
})

//Change password
exports.changePassword=catchAsyncError(async(req,res,next)=>{
    const user=await userModel.findById(req.user.id).select('+password');
    //check old password
    if(!await user.isValidPassword(req.body.oldPassword)){
          return next(new ErrorHandler('Invalid old password',401));
    }
    //assigning new password
    user.password=req.body.password;
    await user.save();
    res.status(200).json({
        success:true
    })
})

//update profile
exports.updateProfile=catchAsyncError(async(req,res,next)=>{
    let newUserData={
        name:req.body.name,
        email:req.body.email
    }
    let avatar;
    if(req.file){
        avatar=`${process.env.BACKEND_URL}/uploads/user/${req.file.originalname}`
        newUserData={...newUserData,avatar}
    }
    const user=await userModel.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true
    });
    res.status(200).json({
        success:true,
        user
    })

})
//Admin: Get All Users 
exports.getAllUsers = catchAsyncError(async (req, res, next) => {
    const users = await userModel.find();
    res.status(200).json({
         success: true,
         users
    })
 })

//Admin: Get Specific User
exports.getUser = catchAsyncError(async (req, res, next) => {
    const user = await userModel.findById(req.params.id);
    if(!user) {
        return next(new ErrorHandler(`User not found with this id ${req.params.id}`))
    }
    res.status(200).json({
        success: true,
        user
   })
});

//Admin: Update User 
exports.updateUser = catchAsyncError(async (req, res, next) => {
    const newUserData = {
        role: req.body.role
    }

    const user = await userModel.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
    })

    res.status(200).json({
        success: true,
        user
    })
})

//Admin: Delete User 
exports.deleteUser = catchAsyncError(async (req, res, next) => {
    try{
       await userModel.findByIdAndDelete(req.params.id);
       res.status(200).json({
        success:true,
        message:'User deleted successfully'
       })
       
    }
    catch(error){
        res.status(404).json({
            success: false,
            message: "User not found",
            error: error.message
        });
    }
   
})