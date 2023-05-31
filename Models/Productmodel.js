const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ProductSchema = new Schema({
    Name: {
        type: String,
        required: [true, "Please enter aa product name"]
    },
    quantity: {
        type: Number,
        required: true,
        default: 0

    },
    prise: {
        type: Number,
        required: true,
    },
},
    {

        timestamp: true
    }
)



const Product = mongoose.model('product', ProductSchema);

module.exports = Product
