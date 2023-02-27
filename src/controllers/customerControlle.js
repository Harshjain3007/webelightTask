const customermodel = require('../Models/customerModel')
const jwt=require('jsonwebtoken')

const createCustomer=async function(req,res){
    try{
    let data=req.body
    let saveddata=await customermodel.create(data)
    return res.status(201).send({message:'successfull',data:saveddata})
    }catch(error){
        return res.status(500).send({status:false,message:error.message})
    }
}

const loginCustomer = async function(req,res){
    try{
    let data=req.body
    let {email,password} = data
    let findCustomer= await customermodel.findOne({email:email,password:password})
    const token=jwt.sign({
         customer_Id:findCustomer._id.toString(),
        eamil_id:findCustomer.email
    },'this is the secret key')
    res.setHeader('x-api-key',token)
    res.status(201).send({status:true,data:token})
}catch(error){
    return res.status(500).send({status:false,message:error.message})
}
}



module.exports.createCustomer = createCustomer
module.exports.loginCustomer=loginCustomer

