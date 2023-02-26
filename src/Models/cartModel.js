const mongoose =require('mongoose')
let ObjectId=mongoose.Schema.Types.ObjectId

let cartSchema = new mongoose.Schema({
    customerId:{
        type:ObjectId,
        ref:'customer',
        required:true,
        unique:true
    },
    items:[{
         _id:false,
         productId:{ 
            type: ObjectId,
            ref: "product", 
            required: true 
        },
       
         quantity: { 
            type: Number, 
            required: true, 
            min: 1 ,
         }
    }],
    totalPrice:{
        type:Number,
        required:true,
    },
    totalItems:{
        type:Number,
        required:true
    }

},{timeStamps:true})
module.exports=mongoose.model('cart',cartSchema)