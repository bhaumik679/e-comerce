const express = require('express')
const router = express.Router()
const Productcontrollers = require('../Controllers/ProductControllers')
const verifyToken = require('../Helpers/jwtHelper').verifyAccessToken

//find all product
router.get('/products', Productcontrollers.getAllProducts)

//find product with id
router.get('/products/:id', Productcontrollers.getProductbyid)

//post a product
router.post('/products', verifyToken, Productcontrollers.postProduct)

//update a product
router.put('/products/:id', verifyToken, Productcontrollers.updateProduct)

//Delete a product
router.delete('/products/:id', verifyToken, Productcontrollers.deleteProduct)


module.exports = router