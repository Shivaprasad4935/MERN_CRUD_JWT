const mongoose = require('mongoose')

const UserDesign = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
        lowercase : true,
        unique : true,
        index : true
    },
    age : {
        type : Number,
        required : true,
    }
})

const usermodel = mongoose.model("usermodel",UserDesign)
module.exports = usermodel