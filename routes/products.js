const express = require('express')
const router = express.Router()
const {getAllProducts,getAllProductsStatic} = require('../controllers/products')
router.route('/').get(getAllProductsStatic)
router.route('/tell').get(getAllProducts)
module.exports = router