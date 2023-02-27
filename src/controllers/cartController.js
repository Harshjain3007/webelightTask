const mongoose = require('mongoose')

const cartmodel=require('../Models/cartModel')
const productModel = require('../Models/productModel')


const createCart = async function(req, res) {
  try {
      const customerId = req.params.customerId;
      const { productId, cartId, quantity } = req.body;

      const productExist = await productModel.findOne({ _id: productId, isDeleted: false });
      if (!productExist) {
          return res.status(400).send({ status: false, msg: 'Product has been deleted or does not exist' });
      }

      const productPrice = productExist.price;
      const productName = productExist.name;
      const productDetails = { productId, productName, quantity: 1 };

      let findCart;
      if (cartId) {
          findCart = await cartmodel.findOne({ _id: cartId, customerId });
          if (!findCart) {
              return res.status(400).send({ status: false, msg: 'Cart ID does not exist' });
          }
      } else {
          findCart = await cartmodel.findOne({ customerId });
      }

      if (findCart) {
          const alreadyProductsId = findCart.items.map(x => x.productId.toString());
          if (alreadyProductsId.includes(productId)) {
              const updatedCart = await cartmodel.findOneAndUpdate(
                  { "items.productId": productId, customerId },
                  { $inc: { "items.$.quantity": 1, totalPrice: productPrice } },
                  { new: true }
              );
              return res.status(201).send({ status: true, data: updatedCart });
          } else {
              const updatedCart = await cartmodel.findOneAndUpdate(
                  { customerId },
                  { $push: { items: productDetails }, $inc: { totalItems: 1, totalPrice: productPrice } },
                  { new: true }
              );
              return res.status(201).send({ status: true, message: 'Success', data: updatedCart });
          }
      }

      const createCart = {
          customerId,
          items: [productDetails],
          totalItems: 1,
          totalPrice: productPrice
      };
      const cartCreated = await cartmodel.create(createCart);
      return res.status(201).send({ status: true, data: cartCreated });
  } catch (error) {
      console.log(error);
      return res.status(500).send({ status: false, message: error.message });
  }
};


const getCart = async function(req,res){
    try{
    let customerId=req.params.customerId
    let findcart=await cartmodel.findOne({customerId}).select({createdAt:0,updatedAt:0}).populate('items.productId',{ __v: 0, _id: 0, isDeleted: 0, createdAt: 0, deletedAt: 0})
    if(findcart.items.length==0) return res.status(200).send({status:true,message:'your cart is empty',data:findcart})
    res.status(400).send({status:true,msg:'success',data:findcart})
    }catch(error){
        return res.status(500).send({status:false,msg:err.msg})
    }
    }


const updateCart=async function(req,res){
    try{
    let customerId=req.params.customerId
    let data =req.body
  let {productId,cartId,removeProduct} =data
    removeProduct=parseInt(removeProduct)
   let findCart= await cartmodel.findOne({_id:cartId,customerId})
   if(!findCart) return res.status(400).send({status:false,message:'no cart found'})
   let itemsOfCart=findCart.items
   if(itemsOfCart.length==0) return res.status(400).send({status:false,message:'cart is already empty'})
   if(!productId) return res.status(400).send({status:false,message:'productID is mandatory'})
   let checkproduct=itemsOfCart.map(e=>x.productId.toString())
   if(!checkproduct.includes(productId)) res.status(400).send({status:false,message:'productId not found'})
   let findProduct = await productModel.findOne({_id:productId,isDeleted:false})
    if(!('removeProduct' in req.body)) return res.status(400).send({status:false,message:'removeProduct is mandatory'})
    if(!(removeProduct==0||removeProduct==1)) return res.status(400).send({status:false,message:'remove product should be either 0 or 1'})
    for(let i=0;i<itemsOfCart.length;i++){
        if(itemsOfCart[i].productId==productId){
            let priceChange=itemsOfCart[i].quantity*findProduct.price;
            if(removeProduct==0){
    const update = await cartmodel.findOneAndUpdate({ _id: cartId }, { $pull: { items: { productId: productId } }, totalPrice: findCart.totalPrice - priceChange, totalItems: findCart.totalItems - 1 }, { new: true })
                return res.status(200).send({ status: true, message: 'Remove product Successfully', data: update })
           }
           if(removeProduct==1){
            if (itemsOfCart[i].quantity == 1) {
     const update = await cartmodel.findOneAndUpdate({ _id: cartId }, { $pull: { items: { productId: productId } }, totalPrice: findCart.totalPrice - priceChange, totalItems: findCart.totalItems - 1 }, { new: true })
     return res.status(200).send({ status: true, message: 'Remove product Successfully & price updated', data: update })
            } 
            itemsOfCart[i].quantity = itemsOfCart[i].quantity - 1;
         const update = await cartModel.findOneAndUpdate({ _id: cartId }, { items: itemsOfCart, totalPrice: findCart.totalPrice - findProduct.price }, { new: true })
          return res.status(200).send({ status: true, message: 'Success', data: update }) 
           }
        }
    }
}catch(error){
    return res.status(500).send({status:false,message:error.message})
}
}


const deleteCart=async function(req,res){
    try{
    let customerId=req.params.customerId
    let findCart = await cartmodel.findOne({customerId})
    if(!findCart) return res.status(404).send({status:false,message:'no such cart exist'})
    const deleteCart=await cartmodel.findOneAndUpdate({_id:findCart._id},{items:[],totalPrice:0,totalItems:0},{new:true})
    return res.status(404).send({status:false,msg:'cart deleted successfully',data:deleteCart})
    }catch(error){
        return res.status(500).send({status:false,message:error.message})
    }
}



module.exports.createCart=createCart
module.exports.getCart=getCart
module.exports.deleteCart=deleteCart
module.exports.updateCart=updateCart

