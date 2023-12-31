const express = require('express')
const multer = require('multer')

const router = express.Router()

const Post = require('../models/post')

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype]
    let error = new Error("Invalid mime type")
    if(isValid) {
      error = null
    }
    cb(error, "backend/images")
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext)
  }
})

router.patch("/:id", multer({storage: storage}).single('image'), (req, res, next) => {
  let imagePath = req.body.imagePath
  if(req.file) {
    const url = req.protocol + "://" + req.get("host")
    imagePath = url + "/images/" + req.file.filename
  }
  Post.updateOne({_id: req.params.id}, req.body).then(result => {
    console.log(result)
  })
  res.status(201).json({message: 'Update successful'})
})

router.post("", multer({storage: storage}).single('image'), (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  const post = new Post({title: req.body.title, content: req.body.content, imagePath: url + '/images/' + req.file.filename});
  console.log(post)
  post.save().then((result) => {
    console.log(result)
    res.status(201).json({message: 'Post added successfully', post: {
      ...result,
      id: result._id
    }})
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
