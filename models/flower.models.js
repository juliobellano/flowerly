const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema(
    {
        flowername: {
            type: String,
            required: [true, "please enter flower name"]
        },
        
        username: {
            type: String,
            required: [true, "please enter flower name"]
        },

        quantity: {
            type: Number,
            required: true,
            default: 0
        },

        coordinatex: {
            type: Number,
            required: true,
            default: 0
        },

        coordinatey: {
            type: Number,
            required: true,
            default: 0
        },
        
        image: {
            type: String,
            required: false
        },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;