const express = require('express');
const app = express();
app.use(express.json());
const dotenv = require("dotenv");
dotenv.config({path:"backend/src/config/config.env"})
// Importing Model

// ---------------------

require('./db/connection'); //Database Connection
 //Database Connection
app.use(require('./router/route'));




app.get('/', (req,res) => {
    res.send("Ecommerce Mern Website")
    next();
})


app.listen(5000,()=>{
    console.log("Server is running at port 5000 .")
})