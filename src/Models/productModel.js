const mongoose=require('mongoose')

const productSchema= new mongoose.Schema({
    "name":{
        type:String,
        required:true,
        unique:true
    },
    'description':{
        type:String,
        required:true,
   },
   'category':{
     type:String,
     enum:['Bakery','Handloom','Footware','Dairy'],
     required:true
    },
   'price':{
    type:Number,
    required:true
   },
   
 
  isDeleted:{
    type:Boolean,
    default:false,
  }
 }, {timeStamps:true})


 module.exports=mongoose.model('product',productSchema)