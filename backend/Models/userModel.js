const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const crypto=require('crypto');

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter name"]
    },
    email:{
        type:String,
        required:[true,'Please enter email'],
        unique:true,
        validate:[validator.isEmail,'Please enter valid email']
    },
    password:{
        type:String,
        required:[true,'Please enter password'],
        maxlength:[7,'Password cannot exceed 10 characters'],
        select:false
    },
    avatar:{
        type:String,
    },
    role:{
        type:String,
        default:'user'
    },
    resetPasswordToken:String,
    resetPasswordTokenExpire:Date,
    createdAt:{
        type:Date,
        default:Date.now
    }
})

//pre is the middleware function
userSchema.pre('save',async function (next){
    if (!this.isModified('password')) {
        return next();
    }
   
    this.password = await bcrypt.hash(this.password, 10);
    /*if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next(); */
})

userSchema.methods.getJwtToken=function(){
    //this sign contain payload,secretKey,options 
    //payload contain main item for user

      return jwt.sign({id:this.id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_TIME
       })
}

userSchema.methods.isValidPassword=async function(enteredPassword){
      return await bcrypt.compare(enteredPassword,this.password)
}

userSchema.methods.getResetToken=function(){
    //Generate token
    const token=crypto.randomBytes(20).toString('hex');
    //Generate hash and set reset password token
    this.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

    //set token expire time
    this.resetPasswordTokenExpire=Date.now()+ 30 * 60 * 1000;
    
    return token;
}

const userModel=mongoose.model('User',userSchema);
module.exports=userModel;


