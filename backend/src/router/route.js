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

const userAuth = require('../middleware/auth');
const ApiFeatures = require("../controller/filter");




router.post('/createProducts', async (req, res) => {
    console.log(req.body);
    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product
    });
})

router.get('/getProducts', userAuth, async (req, res) => {
    try {
        const resultPerPage = 5;
        const apiFeature = new ApiFeatures(Product.find(), req.query).search().filter().pagination(resultPerPage);
        const product = await apiFeature.query;
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
    try {
        const { name, email, password } = req.body;
        const check = await User.findOne({ email });
        if (check) {
            res.status(501).json({
                success: false,
                message: "User exist with this email"
            })
        }
        const user = await User.create({
            name,
            email,
            password,
            avatar: {
                public_id: "Sample ID",
                url: "profilePicture"
            }
        })
        const token = await user.generateAuthToken();
        console.log(token)
        res.status(201).json({
            success: true,
            token,
        })
    } catch (error) {
        res.send(error)
    }
})

router.post('/loginUser', async (req, res) => {
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
        const token = await user.generateAuthToken();
        res.cookie("jwt", token, {
            expires: new Date(
                Date.now() + 5 * 24 * 60 * 60 * 1000
            ),
            httpOnly: true
        });
        return res.status(201).json({
            status: true,
            message: "Success",
            token: token
        })
    } catch (error) {
        console.log("new error");
        return res.send(error)
    }
})

router.post('/changePassword', userAuth, async (req, res) => {
    try {
        const { oldPassword, newPassword, confrimPassword } = req.body;
        // console.log(`Old Password is ${oldPassword} , New Password is ${newPassword} and Confirm Password is ${confrimPassword}`)
        if ((!oldPassword) || (!newPassword) || (!confrimPassword)) {
            return res.status(500).json({
                status: false,
                message: "Fields cannot be left blank"
            })
        }
        const user = req.user;
        const userId = user._id;
        console.log(`userId`)
        console.log(userId)
        // console.log(user)
        if (((newPassword) != (confrimPassword))) {
            return res.status(503).json({
                status: false,
                message: "Password Doesnot match"
            })

        };
        // console.log("user check")
        const User2 = await User.findById(userId)
        // console.log(User2)
        if (!User2) {
            console.log("user not found")
            return res.status(501).json({
                status: false,
                message: "No User"
            })
        }
        const isPasswordMatched = await User2.comparePassword(oldPassword);
        // console.log(`isPasswordMatched`)
        if (!isPasswordMatched) {
            // console.log(`PasswordMatched`)
            return res.status(502).json({
                status: false,
                message: "Old Password is Invalid"
            })
        }
        const newPassHash = await bcrypt.hash(newPassword, 10);
        const update = await User.updateOne({ _id: user._id }, {
            $set: { password: newPassHash }
        })
        console.log(`Update is ${update}`)
        return res.status(201).json({
            status: true,
            message: "Success {Password Change Successfull}"
        })
    } catch (error) {
        console.log("Catch Error");
        return res.status(404).send("new Error")
    }
})
router.get("/logout", userAuth, async (req, res) => {
    try {
        res.clearCookie("jwt");
        console.log("Logged Out");
        await req.user.save();
    } catch (error) {
        res.send(error);
    }
});

router.post('/createProductReview', userAuth, async (req, res) => {
    try {
        const user = req.user;
        const userId = req.user._id;
        const { rating, comment, prodID } = req.body;
        // console.log(req.body)
        const review = {
            user_id: userId,
            name: user.name,
            rating: rating,
            comment: comment
        }
        const product = await Product.findById(prodID);
        // console.log(product)
        const isReviewed =product.reviews.find((rev) => rev.user_id.toString() === userId.toString());
        console.log(isReviewed)
        if (isReviewed) {
            console.log("review done by user ")
            product.reviews.forEach((rev) => {
                if (rev.user_id.toString() === userId.toString())
                    (rev.rating = rating), (rev.comment = comment);
            });
        } else {
            console.log("in else")
            product.reviews.push(review);
            product.numOfReviews = product.reviews.length;
        }
        console.log("out else")
        let count = 0;
        product.reviews.forEach((rev) => {
            count = count + rev.rating;
        }) 
        console.log(count)
        console.log(product.reviews.length)

        product.ratings = count / product.reviews.length;
        console.log(product.ratings)
        await product.save();
        return res.status(201).json({
            status: true,
        })

    } catch (error) {
        console.log("Catch Error")
        res.status(404).send("catch error ")
    }
})







router.get('/demo', userAuth, async (req, res) => {
    console.log(req.user)
    res.send(req.user)
})


module.exports = router;