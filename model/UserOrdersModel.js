const mongoose = require('mongoose');

const UserOrderModel = new mongoose.Schema({
    userDetails:{
        user:{
            name:{
                type:String,
                required:true
            },
            address:{
                type:String,
                required:true
            },
            mobile:{
                type:Number,
                required:true
            },
            email:{
                type:String,
                required:true
            }
        }
    },
    orderDetails:{
        type:Array,
        required:true
    },
    totalAmount:{
        type:Number,
        required:true
    },
    orderDatedOn:{
        type:Date,
        required:true
    }
   

})
const Model = mongoose.model('Order', UserOrderModel);
module.exports= Model;