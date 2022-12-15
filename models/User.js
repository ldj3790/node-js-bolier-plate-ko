const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = mongoose.Schema({
    name : {
        type : String,
        maxlength : 50
    },
    email : {
        type : String,
        trim : true
    },
    password : {
        type : String,
        minlength : 5
    },
    lastname : {
        type : String,
        manlength : 50
    },
    role : {
        type : Number,
        default : 0
    },
    image :  String,
    token : {
        type : String
    },
    tokenExp :{
        type : Number
    }
    
}, { timestamps : true})

const User = mongoose.model('User',userSchema)

//다른파일에서 사용가능해짐
module.exports = {User}