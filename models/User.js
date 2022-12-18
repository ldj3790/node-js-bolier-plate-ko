const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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
    
})

//User 모델이 저장(save 함수)하기 전에탐
userSchema.pre('save',function(next){
    //이거 this가 아마 save 전에 생성된 객체인듯
    var user = this;
    if(user.isModified('password')){
         //비밀번호를 암호화 시킴. 
        bcrypt.genSalt(10, function(err, salt) {
            if(err) return next(err)
            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err) return next(err)
                // hash는 암호화된 password 콜백받음
                user.password   = hash;
                next();
            });
        });
    } else{
        next();
    }
})

userSchema.methods.comparePassword = function(plainPassword,cb){
  bcrypt.compare(plainPassword, this.password, function(err,isMatch){
        if(err) return cb(err)
        cb(null, isMatch)
  })  
}

userSchema.methods.generateToken = function(cb){

    var user = this;

    var token = jwt.sign(user._id.toHexString(),'secretToken');
    user.token = token
    user.save(function(err,user){
        if(err) return cb(err);
        cb(null,user);
    })
}

const User = mongoose.model('User',userSchema)

//다른파일에서 사용가능해짐
module.exports = {User}