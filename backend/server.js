const express=require('express');
const app=express();
const dotenv=require('dotenv');
const path=require('path');
const connectDatabase=require('./config/database');
const errorMiddleware=require('./middlewares/error');
const cookieParser=require('cookie-parser');

dotenv.config({path:(path.join(__dirname,'config','config.env'))});

app.use(express.json());
app.use(cookieParser());
app.use('/uploads',express.static(path.join(__dirname,'uploads')))
connectDatabase();

const products=require('./routes/products');
const auth=require('./routes/user');
const orders=require('./routes/order');
const payment=require('./routes/payment');

app.use('/api/v1',products);
app.use('/api/v1',auth);
app.use('/api/v1',orders);
app.use('/api/v1',payment);

app.use(errorMiddleware);

const server=app.listen(process.env.PORT,()=>{
   console.log(`Server is listening to ${process.env.PORT} in ${process.env.NODE_ENV}`);
})

process.on('unhandledRejection',(err)=>{
   console.log(`Error:${err.message}`);
   console.log('Server is shutting down due to unhandled rejection');
   server.close(()=>{
      process.exit(1);
   })
})