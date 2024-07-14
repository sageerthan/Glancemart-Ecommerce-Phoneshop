const mongoose=require('mongoose');
const connectDatabase=()=>{
    mongoose.connect(process.env.DB_URL).then((con)=>{
       console.log('Database connected to the host:'+con.connection.host)
    })
}

module.exports=connectDatabase;

