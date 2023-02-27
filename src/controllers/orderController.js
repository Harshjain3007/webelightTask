const ordermodel = require('../Models/orderModel')
const productmodel = require('../Models/productModel')
const customermodel=require('../Models/customerModel')
const cartmodel=require('../Models/cartModel')

const createOrder=async function(req,res){
try{
    const data=req.body
    const customerId=req.params.customerId
    let { cartId } = data
   
    if(!cartId) return res.status(400).send({status:false,message:'please enter CartId'})
    let checkCartId = await cartmodel.findById(cartId).select({ _id: 0, createdAt: 0, updatedAt: 0 })
        if (!checkCartId) return res.status(404).send({ status: false, message: 'cartId not found' })
        if(checkCartId.customerId != customerId) return res.status(403).send({ status: false, message: "cartId does not match with customer" })
        let {items} = checkCartId
        if (!items || items.length == 0) return res.status(400).send({ status: false, message: "Cart don't have any product" })

        
        let checkCustoMerwallet = await customermodel.findById({_id:customerId})
        console.log(checkCustoMerwallet)
        let checkCartPrice = await cartmodel.findById({_id:cartId})
        console.log(checkCartPrice)
        if(checkCartPrice.totalPrice>checkCustoMerwallet.wallet){
            return res.status(404).send({status:false,message:'Please add balance to your wallet or reduce some items from cart'})
        }

        let enterData = checkCartId.toObject()
        enterData.totalQuantity = 0
        items.map(x => enterData.totalQuantity += x.quantity)
        const orderData = await ordermodel.create(enterData)
       
        await cartmodel.findOneAndUpdate({ _id: cartId }, { items: [], totalPrice: 0, totalItems: 0 })

        return res.status(201).send({ status: true, message: "Success", data: orderData })
}catch(error){
    return res.status(500).send({ status: false, message: error.message })
}
}



const getOrderhistory =async function(req,res){
    try {
      
       let customerId = req.params.customerId 
    let orderDetails = req.query
    let {totalPrice,OrderedAt,OrderSort,OrderdBefore,OrderedAfter}  = orderDetails
 
   OrderSort=parseInt(OrderSort)

if(OrderdBefore){
        orderDetails.OrderedAt={$lt:orderDetails.OrderdBefore}
    }
    if(OrderedAfter){
        orderDetails.OrderedAt={$gt:orderDetails.OrderedAfter}
    }

    let orderHistory = await ordermodel.find(orderDetails).sort({OrderedAt:OrderSort})
    return res.status(200).send({status:true,orderDetails:orderHistory})
    }catch(error){
        return res.status(500).send({ status: false, message: error.message })
    }
 }



module.exports.createOrder = createOrder
module.exports.getOrderhistory=getOrderhistory