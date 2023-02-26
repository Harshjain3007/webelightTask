const mongoose=require('mongoose')
let ObjectId = mongoose.Schema.Types.ObjectId


const orderSchema = new mongoose.Schema({
    userId:{type:ObjectId,ref:'user',require:true},
    items: [
        {
          productId: {
            type: ObjectId,
            ref: "product",
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
            min: 1,
          },
        },
      ],
      totalPrice: {
        type: Number,
        required: true,
      },
  
      totalItems: {
        type: Number,
        required: true,
      },
  
      totalQuantity: {
        type: Number,
        required: true,
      },
    OrderedAt:{
        type:Date,
        default:new Date()
        }
})
module.exports= mongoose.model('order',orderSchema)