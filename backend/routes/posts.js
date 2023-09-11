const express = require('express')

const router = express.Router()

const Post = require('../models/post')

router.patch("/:id", (req, res, next) => {
  console.log(req.body)
  Post.updateOne({_id: req.params.id}, req.body).then(result => {
    console.log(result)
  })
  res.status(201).json({message: 'Update successful'})
})

router.post("", (req, res, next) => {
  const post = new Post({title: req.body.title, content: req.body.content});
  console.log(post)
  post.save().then((result) => {
    console.log(result)
    res.status(201).json({message: 'Post added successfully', postId: result._id})
  })
})

router.get("/:id", (req, res, next) => {
  console.log('accessing router.get')
  Post.findById(req.params.id)
  .then(post => {
    console.log(post)
    if(post) {
      res.status(200).json({message: 'Post found', post: post})
    } else {
      res.status(404).json({message: 'Post not found'})
    }
  })
  .catch(() => {
    console.log('error')
  })
})

router.get('', (req, res, next) => {
  Post.find()
  .then((documents) => {
      res.status(200).json({
      message: 'Posts fetched successfully',
      posts: documents
    })
  })
})


router.delete('/:id', (req,res,next) => {
  Post.deleteOne({_id: req.params.id}).then((result) => {
    console.log(result)
    res.status(200).json({message: 'Posts deleted'})
  })
})

module.exports = router
