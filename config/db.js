const mongoose = require('mongoose');

const connectDB = async()=>{
try{
    const connect = mongoose.connect(process.env.DB_URI);
    console.log("MongoDB Connected:" + connect);
}catch(error){
    console.log("error connection :" + error.message);
    process.exit(1);
}
}

module.exports = connectDB;