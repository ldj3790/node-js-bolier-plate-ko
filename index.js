const express = require('express')
const app = express()
const port = 5000

const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

//Mongoose DB에 connetecd 정보 넣어줘야함.
mongoose.connect('mongodb+srv://yh3790:yh1010@yh3790.xy5z3lf.mongodb.net/?retryWrites=true&w=majority').then(()=>console.log('MongoDb Conntected')).catch(err =>console.log(err))


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})