
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const mongoose = require('mongoose');
const Post = require("../models/post");


mongoose.connect('mongodb://localhost:27017/posts', { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error"));
db.once("open", ()=>{
  console.log("Connectes to db")
})

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors());

//Fetch al posts
app.get('/posts', (req, res) => {
  Post.find({}, 'title description', function (error, posts) {
    if (error) { console.error(error); }
    res.send({
      posts: posts
    })
  }).sort({_id:-1})
})

//Create a new post
app.post('/posts', (req, res)=>{
  let db = req.db;
  let title = req.body.title;
  let description = req.body.description;

  let new_post = new Post({
    title: title,
    description: description
  });

  new_post.save(err=>{
    if(err){
      console.log(err)
    }
    res.send({
      success: true,
      message: 'Post saved succesfully'
    })
  })
})

//Update a post
app.put('/posts/:id', (req,res)=>{
  Post.findById(req.params.id, 'title description', (error, post)=> {
    if (error) { console.error(error); }
    post.title = req.body.title;
    post.description = req.body.description;
    post.save(err=>{
      if(error){
        console.log(error)
      }
      res.send({
        success: true
      })
    })
  })
})
// Fetch single post
app.get('/post/:id', (req, res) => {
  var db = req.db;
  Post.findById(req.params.id, 'title description', function (error, post) {
    if (error) { console.error(error); }
    res.send(post)
  })
})

app.delete('/posts/:id', (req, res) => {  
  Post.remove({
    _id: req.params.id
  }, (err, post)=> {
    if (err)
      res.send(err)
    res.send({
      success: true
    })
  })
})


app.listen(process.env.PORT || 8081)