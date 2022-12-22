const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const config = require('./config/key')
const { User } = require("./models/User")
const { auth } = require("./middleware/auth")
//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extend:true
}))
//application/json
app.use(bodyParser.json());
app.use(cookieParser());
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

//Mongoose DB에 connetecd 정보 넣어줘야함.
mongoose.connect(config.mongoURI).then(()=>console.log('MongoDb Conntected')).catch(err =>console.log(err))


app.get('/', (req, res) => {
  res.send('Hello World!d')
})


app.post("/api/users/register",(req,res) => {
    //회원 가입할때 필요한 정보들 client에서 가져오면 그것들을 데이터 베이스에 넣어준다.
    //req.body는 클라이언트에서 입력된  id,pd 등을 가져오는데 이게 가능한이유는 bodypaser임포트했기떄문
    const user = new User(req.body)
    user.save((err,userInfo)=>{
       if(err) return res.json({
            success: false, err
       }) 
       return res.status(200).json({
        success: true
       })
    })
})

app.post('/api/users/login',(req,res) => {
  User.findOne({email: req.body.email},(err,user)=>{
    if(!user){
      return res.json({
          loginSuccess: false,
          message : "제공된 이메일에 해당하는 유저가 없습니다."

      })
    }
    user.comparePassword(req.body.password, (err,isMatch) =>{
      if(!isMatch)
        return res.json({loginSuccess : false, message : "비밀번호가 틀렸습니다."});
        user.generateToken((err,user)=>{
          console.log("ss");
          if(err) return res.status(400).send(err);
          //토근을 저장한다.
          res.cookie("x_auth",user.token)
          .status(200)
          .json({
            loginSuccess:true,userId:user._id
          })
        })
    })
  })
})

app.get('/api/users.auth', auth ,(req,res)=>{
  //여기까지 미들웨어를 통과해 왔다는 얘기는 Authentication이 True 라는말.
  res.status(200).json({
    _id : req.user._id,
    isAdmin : req.user.role === 0 ? false : true,
    isAuth : true,
    email : req.user.email,
    name : req.user.name,
    lastname : req.user.lastname,
    role : req.uesr.role
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.get('/api/users/logout',auth,(res,req)=>{
  User.findOneAndUpdate({ _id : req.user._id},{token:""},(err,user)=>{
    if(err) return res.json({success : false ,err});
    return res.status(200).send({
      success : true
    })
  })
})