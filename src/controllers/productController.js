const mongoose=require('mongoose')
const ObjectId=mongoose.Types.ObjectId
const productmodel = require('../Models/productModel')



const createProduct = async function(req,res){
    try{
    let data =req.body
    let saveddata=await productmodel.create(data)
    return res.status(201).send({status:true,data:saveddata})
}catch(error){
    return  res.status(500).send({status:false,message:error.message})
}
}

const getProductslist = async function(req,res){
    try{
    let productdetails = req.query
    let {category,price,priceSort,pricelessthan,pricegreaterthan,page,limit} = productdetails
    priceSort=parseInt(priceSort)

    if(pricelessthan){
        productdetails.price={$lt:productdetails.pricelessthan}
    }
    if(pricegreaterthan){
        productdetails.price={$gt:productdetails.pricegreaterthan}
    }
    let skip=(page-1)*limit
    let productData = await productmodel.find(productdetails).sort({price:priceSort}).limit(limit).skip(skip)
    TotalProductCount = productData.length
    return res.status(200).send({status:true,productdetails:productData,TotalProductCount})
}catch(error){
       return res.status(500).send({status:false,message:error.message})
    }
}


const updateProductDetails = async function(req,res){
    try{
    const productId=req.params.productId 

     let updateProductDetails = req.body
    let {name,description,category,price} = updateProductDetails
    let findProductId = await productmodel.findById({_id:productId,isDeleted:false})
    if(!findProductId) return res.status(404).send({status:false,msg:'product does not exist or may be deleted'})
   
    updateProductDetails._id=productId
    const updateDetails = await productmodel.findOneAndUpdate({_id:productId,isDeleted:false},updateProductDetails,{new:true})
    return res.status(200).send({status:true,message:'product updated successfully',updateDetails:updateProductDetails})
    }catch(error){
        return res.status(500).send({status:false,message:error.message})
    }
}

const deleteProduct = async function(req,res){
    try{
     let productId = req.params.productId

     if (!ObjectId.isValid(productId)) {
        return res.status(400).send({status: false, message: 'Invalid productId'});
      }
    
     const checkProduct = await productmodel.findById({_id:productId,isDeleted:false})
     if(!checkProduct) return res.status(404).send({status:false,message:'product not available or may be deleted'})

     await productmodel.findOneAndUpdate({_id:productId,isDeleted:false},{$set:{isDeleted:true}},{new:true})
     res.status(200).send({status:true,message:'product deleted successfully'})
    }catch(error){
        return res.status(500).send({status:false,message:error.message})
    }
}




module.exports.createProduct=createProduct
module.exports.getProductslist=getProductslist
module.exports.updateProductDetails=updateProductDetails
module.exports.deleteProduct=deleteProduct