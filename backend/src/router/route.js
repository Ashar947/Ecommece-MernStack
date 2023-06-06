const express = require("express");
const router = express.Router();
require('../db/connection');
const dotenv = require("dotenv");
dotenv.config({ path: "backend/src/config/config.env" })
// const cookieParser = require('cookie-Parser');
// router.use(cookieParser());

const Product = require('../models/productSchema')
const User = require('../models/userSchema')



router.post('/createProducts', async (req, res) => {
    console.log(req.body);
    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product
    });
})

router.get('/getProducts', async (req, res) => {
    const product = await Product.find();
    res.status(201).json({
        success: true,
        product
    });
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


router.post('/registerUser',async(req,res)=>{
    const{name,email,password}=req.body;
    const user = await User.create({
        name,
        email,
        password,
        avatar:{
            public_id:"Sample ID",
            url:"profilePicture"
        }
    })

    const token = user.generateAuthToken();
    console.log(token)

    res.status(201).json({
        success:true,
        token,
    })


})

router.post('/loginUser',async(req,res)=>{
    const{email,password} = req.body;
    console.log(`Email is ${email} Password is ${password}`)
    // if ((email.length===0) || (!password.length===0)){
    //     res.status(500).json({
    //         message:"Email/Password cannot be left empty"
    //     })

    // }
    const user = await User.findOne({email}).select("+password");

    if(!user){
        res.status(501).json({
            message:"User Not Found"
        })
    }
    
    const isPasswordMatch = user.comparePassword(password);
    
    if (!isPasswordMatch){
        if(!user){
            res.status(502).json({
                message:"Password Not Matched"
            })
        }

    }

    const token = user.generateAuthToken();
    console.log(token)

    res.status(201).json({
        success:true,
        token,
    })


})




module.exports = router;