const jwt = require("jsonwebtoken");
const User = require('../models/userSchema');
const dotenv = require("dotenv");
dotenv.config({ path: "backend/src/config/config.env" })

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        // console.log(token)
        if (!token) {
            return res.status(309).json({
                status: false,
                message: "no Token"
            })
        }
        const verifyToken = jwt.verify(token, "JKFDHSFJKDHF38HKJAHKJAHFJKHAJKFHAJKFH");
        const user = await User.findOne({ _id: verifyToken._id });
        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        res.status(401).send('No User Login')
        console.log(error)
    }
}

module.exports = auth;
