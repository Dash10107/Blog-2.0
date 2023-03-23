//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "This is the home page for this blog website . Here you can visit all the blogs you have created .  ";
const aboutContent = "This is the about section for this blog . This blog is basically a project I created after learning javascript ";
const contactContent = "This the contact section for this blog . I am not adding any contact for now but it will come soon. ";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://Dash10107:test123@cluster0.dxl9zuf.mongodb.net/blogDB");

const postSchema = {
  title:String,
  content:String
};

const Post =mongoose.model("Post",postSchema);



let posts = [];

app.get("/", function(req, res){

  Post.find({},function(err,posts) {
  res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });
  
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post =  new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  post.save(function(err) {
  if(!err){
    res.redirect("/");
  };
  });
});

app.get("/posts/:postId", function(req, res){
  const requestedID =req.params.postId;

  Post.findOne({_id:requestedID},function(err,post){
    res.render("post", {
      title: post.title,
      content: post.content,
      _id:requestedID
    });
  });
});

app.post("/delete",function(req,res){
 const ID = req.body.Delete
 Post.findByIdAndRemove(ID,function(err){
  if(!err){
    res.redirect("/");
  };
 });
});


let port = process.env.PORT;
if(port == null || port == ""){
  port = 3000;
}

app.listen(port, function() {
  console.log("Server has started succesfully. ");
});
