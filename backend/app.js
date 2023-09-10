const express = require('express')
const mongoose = require('mongoose')

const app = express();
const bodyParser = require("body-parser")

const Post = require('./models/post')
mongoose.connect('mongodb+srv://alonzosanchez3:An20zx3Uf71s1JTm@cluster0.elvs0u8.mongodb.net/?retryWrites=true&w=majority')
.then(() => {
  console.log(('Connected to database'))
})
.catch(() => {
  console.log('Connection Failed')
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader('Access-Control-Allow-Methods', "GET, POST, PATCH, DELETE, OPTIONS")
  next()
})

app.post("/api/posts", (req, res, next) => {
  const post = new Post({title: req.body.title, content: req.body.content});
  console.log(post)
  post.save().then((result) => {
    console.log(result)
    res.status(201).json({message: 'Post added successfully', postId: result._id})
  })
})

app.get('/api/posts', (req, res, next) => {
  Post.find()
  .then((documents) => {
      res.status(200).json({
      message: 'Posts fetched successfully',
      posts: documents
    })
  })
})

app.delete('/api/posts/:id', (req,res,next) => {
  Post.deleteOne({_id: req.params.id}).then((result) => {
    console.log(result)
    res.status(200).json({message: 'Posts deleted'})
  })
})

module.exports = app;