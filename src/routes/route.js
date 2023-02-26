const express=require('express')

const router = express.Router()

const customercontroller = require("../controllers/customerControlle")
const productcontroller = require('../controllers/productController')
const cartcontroller=require('../controllers/cartController')
const ordercontroller=require('../controllers/orderController')
 
router.post('/createCustomer',customercontroller.createCustomer)
router.post('/loginCustomer',customercontroller.loginCustomer)
router.post('/createProduct',productcontroller.createProduct)
router.get('/getproductlist',productcontroller.getProductslist)
router.put('/updateproduct/:productId',productcontroller.updateProductDetails)
router.delete('/deleteproduct/:productId',productcontroller.deleteProduct)

router.post('/customer/:customerId/cart',cartcontroller.createCart)
router.get('/customer/:customerId/cart',cartcontroller.getCart)
router.put('/customer:/customerId/cart',cartcontroller.updateCart)
router.delete('/customer/:customerId/cart',cartcontroller.deleteCart)

router.post('/createOrder/:customerId',ordercontroller.createOrder)

module.exports = router
