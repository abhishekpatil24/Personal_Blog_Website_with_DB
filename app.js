//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const _ = require("lodash");

const homeStartingContent =
  "Welcome Back! Hope you had a great day!";
const aboutContent =
  "Hello I am a 2023 Graduate in Computer Engineering from SPPU Pune";
const contactContent =
  "You can contact me at patilabhishek7495@gmail.com";

const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/blogDB");

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


const postSchema = {
  title: String,
  content: String,
};

const Post = mongoose.model("Post", postSchema);


app.get("/", function (req, res) {
  Post.find({})
    .then((posts) => {
      res.render("home", {
        startingContent: homeStartingContent,
        posts: posts,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Internal Server Error");
    });
});

app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
  });

  post.save();

  res.redirect("/");
});

app.get("/posts/:postId", function (req, res) {
  const requestedPostId = req.params.postId;
  const requestedTitle = _.lowerCase(req.params.postName);

  Post.findOne({ _id: requestedPostId })
    .then(post => {
      if (post) {
        res.render("post", {
          title: post.title,
          content: post.content
        });
      } else {
        res.status(404).send("Post not found");
      }
    })
    .catch(error => {
      console.error(error);
      res.status(500).send("Internal Server Error");
    });
});


app.listen(3000, function () {
  console.log("Server started on port 3000");
});
