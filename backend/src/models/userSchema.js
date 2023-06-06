const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const validator = require('validator');
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
dotenv.config({ path: "backend/src/config/config.env" })

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: [4],
        maxLength: [30]
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail, "Enter a valid Email"]
    },
    password: {
        type: String,
        required: true,
        minLength: [8, 'Password should be greater than 8 characters'],
        select: false,
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        },
    },
    role: {
        type: String,
        default:"user"
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,

})
// hasing passowrd
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
})
// JWT TOKEN
userSchema.methods.generateAuthToken = async function () {
    console.log(`Token == generating `)
    try {
        return jwt.sign({ _id: this._id },`${process.env.JWT_SECRETKEY}`,{
            expiresIn:"2d",
        });
    } catch (error) {
        console.log(`error is ${error}`);
    }
}
//  Compare Password
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)

}

const User = mongoose.model('User', userSchema);
module.exports = User


