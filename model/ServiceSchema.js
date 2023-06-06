const mongoose = require('mongoose');


const serviceSchema = new mongoose.Schema({
    id:{
        type:Number,
        required:true
    },
    validationTooltip01:{
        type:String,
        required:true
    },
    validationTooltip02:{
        type:String,
        required:true
    },
    validationTooltip03:{
        type:String,
        required:true
    },
    validationTooltip04:{
        type:Number,
        required:true
    },
    validationTooltip05:{
        
            type:String
        
    
    }
    

})

const Model = mongoose.model('Service', serviceSchema);

module.exports= Model;