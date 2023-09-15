const express = require('express')
const mongoose = require('mongoose')
const path = require('path')

const app = express();
const bodyParser = require("body-parser")

const postsRoutes = require('./routes/posts')

mongoose.connect('mongodb+srv://alonzosanchez3:An20zx3Uf71s1JTm@cluster0.elvs0u8.mongodb.net/?retryWrites=true&w=majority')
.then(() => {
  console.log(('Connected to database'))
})
.catch(() => {
  console.log('Connection Failed')
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}));
app.use("/images", express.static(path.join('backend/images')))


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader('Access-Control-Allow-Methods', "GET, POST, PATCH, DELETE, OPTIONS")
  next()
})

app.use('/api/posts', postsRoutes)



module.exports = app;