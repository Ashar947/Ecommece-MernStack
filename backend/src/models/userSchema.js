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
        default: "user"
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
    

})
userSchema.methods.generateAuthToken = async function () {
    try {
        console.log(`${process.env.JWT_SECRETKEY}`)
        console.log(`Token == generating `)
        let genToken =jwt.sign({ _id: this._id.toString() },"JKFDHSFJKDHF38HKJAHKJAHFJKHAJKFHAJKFH");
        console.log(`Token == ${genToken}`)
        console.log(`gentoken`)
        this.tokens = this.tokens.concat({token:genToken}); 
        await this.save();
        return genToken;
        
    } catch (error) {
        console.log(`error is ${error}`);
    }
}


// hasing passowrd
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
})

//  Compare Password
userSchema.methods.comparePassword = async function (enteredPassword,next) {
    console.log(`Entered Password ${enteredPassword} this passowrd is ${this.password}` )
    return await bcrypt.compare(`${enteredPassword}`, `${this.password}`);

}

const User = mongoose.model('User', userSchema);
module.exports = User


