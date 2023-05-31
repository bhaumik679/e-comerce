const Product = require('../Models/Productmodel')
const User = require('../Models/Usermodel');

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({})
        res.status(200).json({ products })

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message })
    }
}

const getProductbyid = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id)
        res.status(200).json({ product })

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message })
    }
}
const postProduct = async (req, res) => {
    try {
        const userId = req.paylod.userId;
        const user = await User.findById(userId);
        if (user.type !== 'admin') {
            return res.status(409).json({ message: 'Unauthorized!' })
        }
        const product = await Product.create(req.body)
        res.status(200).json({ product })

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message })
    }
}
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndUpdate(id, req.body)
        //can not find any product in database
        if (!product) {
            return res.status(404).json({ message: `can not find any product with ID ${id}` })

        }
        const updatedProduct = await Product.findById(id)
        res.status(200).json(updatedProduct)



    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message })
    }
}
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);
        //can not find any product in database
        if (!product) {
            return res.status(404).json({ message: `can not find any product with ID ${id}` })

        }
        res.status(200).json({ product })


    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message })
    }
}
module.exports = {
    getAllProducts,
    getProductbyid,
    postProduct,
    updateProduct,
    deleteProduct
}