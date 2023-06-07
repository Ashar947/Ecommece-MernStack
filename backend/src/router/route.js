const express = require("express");
const router = express.Router();
require('../db/connection');
const bcrypt = require('bcryptjs')
const dotenv = require("dotenv");
dotenv.config({ path: "backend/src/config/config.env" })
const cookieParser = require('cookie-Parser');
router.use(cookieParser());

const Product = require('../models/productSchema')
const User = require('../models/userSchema');

const auth = require('../middleware/auth');



router.post('/createProducts', async (req, res) => {
    console.log(req.body);
    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product
    });
})

router.get('/getProducts', async (req, res) => {
    try {
        const product = await Product.find();
        res.status(201).json({
            success: true,
            product
        });
    } catch (error) {
        console.log(error);
        return res.send(error)
    }
})

router.get('/product/:id', async (req, res) => {
    let id = req.params.id;
    const product = await Product.findById(id);
    if (!product) {
        return res.status(500).json({
            success: false,
            message: "product not found"
        })
    }

    res.status(201).json({
        success: true,
        product
    });
})

router.put('/updateProducts/:id', async (req, res) => {
    let id = req.params.id;
    const product = await Product.findById(id);
    if (!product) {
        return res.status(500).json({
            success: false,
            message: "product not found"
        })
    }

    const getprod = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindandModify: false
    })

    res.status(201).json({
        success: true,
        getproduct
    });
})

router.delete('/deleteProducts/:id', async (req, res) => {
    let id = req.params.id;
    const product = await Product.findById(id);
    if (!product) {
        return res.status(500).json({
            success: false,
            message: "product not found"
        })
    }

    await product.remove();

    res.status(201).json({
        success: true,
        message: "Product Deleted Successfully"
    });
})


router.post('/registerUser', async (req, res) => {
    const { name, email, password } = req.body;
    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: "Sample ID",
            url: "profilePicture"
        }
    })
    const token =await user.generateAuthToken();
    console.log(token)
    res.status(201).json({
        success: true,
        token,
    })
})

router.post('/loginUser', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if ((!email) || (!password)) {
            return res.status(500).json({
                status: false,
                message: "Email/Password cannot be blank"
            })
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(501).json({
                status: false,
                message: "Email is Invalid"
            })
        }
        const isPasswordMatched = await user.comparePassword(password);
        console.log(`isPasswordMatched == ${isPasswordMatched}`)
        if (!isPasswordMatched) {
            return res.status(502).json({
                status: false,
                message: "password is Invalid"
            })
        }
        const token =await user.generateAuthToken();
        res.cookie("jwt", token, {
            expires: new Date(
                Date.now() + 5 * 24 * 60 * 60 * 1000
            ),
            httpOnly: true
        });
        return res.status(201).json({
            status: true,
            message: "Success",
            token:token
        })
    } catch (error) {
        console.log("new error");
        return res.send(error)
    }
})




module.exports = router;