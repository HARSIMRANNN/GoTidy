const mongoose = require('mongoose');


const regSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    address: {
        type: String,
    },
    mobile: {
        type: Number,
        required: true

    },
    orders: [
        {
            datedOn: {
                type: String,
                required:true
            },
            orderSummary: [
                {
                serviceType: {
                    type: String,
                    required:true
                },
                price: {
                    type: Number,
                    required:true
                },
                image: {
                    type: String,
                    required:true
                }
            }
            ],
            totalAmount: {
                type: Number,
                required:true
            }
        }
    ]


})

const Model = mongoose.model('User', regSchema);

module.exports = Model;