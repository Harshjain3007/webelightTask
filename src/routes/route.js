const express=require('express')

const router = express.Router()

const customercontroller = require("../controllers/customerControlle")
const productcontroller = require('../controllers/productController')
const cartcontroller=require('../controllers/cartController')
const ordercontroller=require('../controllers/orderController')
const middle=require('../middlewares/auth')
 
router.post('/createCustomer',customercontroller.createCustomer)
router.post('/loginCustomer',customercontroller.loginCustomer)

router.post('/createProduct',productcontroller.createProduct)
router.get('/getproductlist',productcontroller.getProductslist)
router.put('/updateproduct/:productId',productcontroller.updateProductDetails)
router.delete('/deleteproduct/:productId',productcontroller.deleteProduct)

router.post('/customer/:customerId/cart',middle.authenticate,middle.authorisation,cartcontroller.createCart)
router.get('/customer/:customerId/cart',middle.authenticate,middle.authorisation,cartcontroller.getCart)
router.put('/customer:/customerId/cart',middle.authenticate,middle.authorisation,cartcontroller.updateCart)
router.delete('/customer/:customerId/cart',middle.authenticate,middle.authorisation,cartcontroller.deleteCart)

router.post('/createOrder/:customerId',middle.authenticate,middle.authorisation,ordercontroller.createOrder)
router.get('/getOrder/:customerId',middle.authenticate,middle.authorisation,ordercontroller.getOrderhistory)

module.exports = router
