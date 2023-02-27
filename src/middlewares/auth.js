const jwt = require('jsonwebtoken')
const customermodel = require("../Models/customerModel")
const mongoose = require('mongoose')

const authenticate = async function(req,res,next){
    try{
    let token = req.headers["x-api-key"]
    if(!token) token = req.headers["x-api-key"]
    if(!token) return res.status(401).send({status : false, msg : "You are not logged in(token Missing)"})
    
    jwt.verify(token, "this is the secret key", (err, user) => {
        if (err)
          return res.status(401).send({ message: "invalid token" });
         req.user = user;
        next();
      });

    }catch(error){
        return res.status(500).send({status:false,message:error.message})
    }
}


const authorisation = async function(req,res,next){
        try{
        let customerId = req.params.customerId
         console.log(customerId)
         let a = req.user.customer_Id
         
        let customerDetail =await customermodel.findById(customerId)
        if(!customerDetail) return res.status(404).send({staus : false, msg : "No such customer"})
        // let decodeToken = jwt.verify(token,"this is my secret key")
         
        if(customerDetail.customerId != a.customer_Id) 
        return res.status(403).send({status : false, msg : "You are not authorised"})
        next()
        }catch(error){
            return res.status(500).send({status:false,message:error.message})
        }
    }

    

module.exports.authenticate = authenticate
module.exports.authorisation = authorisation