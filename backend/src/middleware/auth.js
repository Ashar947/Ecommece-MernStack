const jwt = require("jsonwebtoken");
const User = require('../models/userSchema');
const dotenv = require("dotenv");
dotenv.config({ path: "backend/src/config/config.env" })

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        console.log(token)
        if (!token) {
            return res.status(309).json({
                status: false,
                message: "no Token"
            })
        }
        const verifyToken = jwt.verify(token, "JKFDHSFJKDHF38HKJAHKJAHFJKHAJKFHAJKFH");
        const user  = await User.findOne({ _id: verifyToken._id });
        req.token = token;
        req.user = user;
        next();


    } catch (error) {
        res.status(401).send('Admin Not Found')
        console.log(error)
    }

}

module.exports = auth;




// const jwt = require("jsonwebtoken");
// const Register = require("../models/register");
// const async = require("hbs/lib/async");

// const auth = async(req,res,next) =>{
//     try{
//         const  token = req.cookies.jwt;
//         const verifyUser = jwt.verify(token,"Lorem ipsum dolor, sit amet consectetur adipisicing elit.");
//         // console.log(verifyUser);
//         const user = await Register.findOne({_id:verifyUser._id});
//         // console.log(user);
//         req.token = token;
//         req.user = user;
//         next();
//     } catch(error){
//         res.status(401).send(error);
//     }
// }

// module.exports = auth;