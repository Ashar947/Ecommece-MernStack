const jwt = require("jsonwebtoken");
const User = require('../models/userSchema');
const dotenv = require("dotenv");
dotenv.config({ path: "backend/src/config/config.env" })

const Adminauth = async (req, res, next) => {
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
        if ((user.role)!='admin'){
            return res.status(310).json({
                status: false,
                message: "Admin Required"
            })
        }
        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        res.status(404).send('Admin Not Found')
        console.log(error)
    }

}

module.exports = Adminauth;
