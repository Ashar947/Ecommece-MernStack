const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/ecommerceMern",{
}).then (()=>{
    console.log("Connection Succesful");
}).catch((err)=>{
    console.log(`${err}`);
});