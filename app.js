const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({
  extended: true
}));
app.use(express.static("public"));


////////////////////////// DATABASE ///////////////////////////
mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true, useUnifiedTopology: true});

 const articleSchema = {
   title: String,
   content: String
 };

 const Article = mongoose.model("article", articleSchema);

////////////////////////// REQUESTs TARGETING ALL ARTICLES ///////////////////////////
app.route("/articles")
.get(function(req, res) {
  Article.find(function(err, foundArticles) {

    if(!err) {
      res.send(foundArticles);
    } else {
      res.send(err);
    }
  });
})

.post(function(req, res) {
  const newArticle = new Article ({
    title: req.body.title,
    content: req.body.content
  });
  newArticle.save(function(err) {
    if(!err) {
      res.send("Successfully added the article.");
    } else {
      res.send(err);
    }
  });
})

.delete(function(req, res) {
  Article.deleteMany(function(err){
    if(!err) {
      res.send("Successfully Deleted the articles.");
    } else {
      res.send(err);
    }
  });
});

////////////////////////// REQUESTs TARGETING A SPECIFIC ARTICLE ///////////////////////////
app.route("/articles/:articleTitle")
.get(function(req, res) {
  Article.findOne({title: req.params.articleTitle}, function(err, foundArticle) {

    if(foundArticle) {
      res.send(foundArticle);
    } else {
      res.send("No Articles Matching with the Tite!");
    }
  });
})

.put(function(req, res) {
  Article.updateOne(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    {overwite: true},
    function(err) {

      if(!err) {
        res.send("Successfully Updated!");
      }
    }
  );
})

.patch(function(req, res) {
  Article.updateOne(
    {title: req.params.articleTitle},
    {$set: req.body}, //req.body used to let the user defined what he/she wants to update.
    function(err){

      if (!err){
        res.send("Successfully Updated!");
      } else {
        res.send(err);
      }
    }
  );
})

.delete(function(req, res) {
  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err){

      if (!err){
        res.send("Successfully Deleted!");
      } else {
        res.send(err);
      }
    }
  );
});



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
