const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema({
    fname:{
        type:String,
        required:true,
    },
    lname:{
        type:String,
        required:true,
    },
    phone:{
        type:Number,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        unique:true
    },
    wallet:{
        type:Number,
        default:2000
    }
},{timeStamps:true})


module.exports= mongoose.model('customer',customerSchema)