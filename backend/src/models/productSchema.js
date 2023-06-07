const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    ratings: {
        type: Number,
        default: 0
    },
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            },
        }
    ],
    category:{
        type:String,
        required:true
    },
    Stock:{
        type:Number,
        required:true,
        maxLength:[4],
        default:1
    },
    numOfReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            user_id:{
                type:String,
                required:true
            },
            name:{
                type:String,
                required:true
            },
            rating:{
                type:Number,
                required:true
            },
            comment:{
                type:String,
                required:true
            }
        }
    ],
    createdAt:{
        type:Date,
        default:Date.now
    }

})
// // hasing passowrd
// userSchema.pre('save', async function (next) {
//     if (this.isModified('password')) {
//         this.password = await bcrypt.hash(this.password, 12);
//     }
//     next();
// })
// adminSchema.methods.generateAuthToken = async function () {
//     try {
//         console.log(`Token == generating `)
//         let genToken = jwt.sign({ _id: this._id },"hostelmanagementsystem");
//         console.log(`Token == ${genToken}`)
//         this.tokens = this.tokens.concat({token:genToken}); 
//         await this.save();
//         return genToken;

//     } catch (error) {
//         console.log(`error is ${error}`);
//     }
// }
const Product = mongoose.model('Product', productSchema);
module.exports = Product;



