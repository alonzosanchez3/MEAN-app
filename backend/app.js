const express = require('express')

const app = express();
const bodyParser = require("body-parser")

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader('Access-Control-Allow-Methods', "GET, POST, PATCH, DELETE, OPTIONS")
  next()
})

app.post("/api/posts", (req, res, next) => {
  const posts = req.body;
  console.log(posts)
  res.status(201).json({message: 'Post added successfully'})
})
app.get('/api/posts', (req, res, next) => {
  const posts = [
    {id: '235fsdf', title: 'First Post', content: 'First post content'},
    {id: '4354dfasdf', title: 'Second Post', content: 'Second post content'},
    {id: '435adfafad', title: 'Third Post', content: 'Third post content'},
  ]
  res.status(200).json({
    message: 'Posts fetched successfully',
    posts: posts
  })
})

module.exports = app;