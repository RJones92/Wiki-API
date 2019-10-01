// jshint esversion: 6
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true
});

const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Article = new mongoose.model("Article", articleSchema);

/////////////////////////////////////////// Requests targetting all articles ////////////////////////////////

app.route("/articles")

  .get(function(req, res){
    Article.find({}, function(err, foundArticles){
      if (!err){
        res.send(foundArticles);
      } else {
        console.log(err);
      }
    });
  })

  .post(function(req, res){
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });
    newArticle.save(function(err){
      if(!err){
        res.send("Success! Fully added a new article.");
      } else {
        res.send(err);
      }
    });
  })

  .delete(function(req, res){
    Article.deleteMany({}, function(err){
        if (!err){
          res.send("All articles were deleted.");
        } else {
          res.send(err);
        }
      }
    );
  });
//End of chained route handler

/////////////////////////////////////////// Requests targetting specific articles ////////////////////////////////

app.route("/articles/:articleTitle")

  .get(function(req, res){
    Article.findOne({ title: req.params.articleTitle }, function(err, foundArticle){
      if (foundArticle){
        res.send(foundArticle);
      } else {
        res.send("Sorry there were no articles matching that title.");
      }
    });
  })

  .put(function(req, res){
    Article.replaceOne(
      {title: req.params.articleTitle},
      {title: req.body.title, content: req.body.content},
      function(err){
        if (!err){
          res.send("Successfully updated " + req.params.articleTitle + " article to your specified body parameters.");
        } else {
          res.send(err);
        }
      }
    );
  })

  .patch(function(req, res){
    Article.updateOne(
      {title: req.params.articleTitle},
      {$set: req.body},
      function(err){
        if (!err){
          res.send("Successfully updated " + req.params.articleTitle + " article to your specified body parameters.");
        } else {
          res.send(err);
        }
      }
    );
  })

  .delete(function(req, res){
    Article.deleteOne(
      {title: req.params.articleTitle},
      function(err){
        if (!err){
          res.send("Successfully deleted " + req.params.articleTitle + " article.");
        } else {
          res.send(err);
        }
      }
    );
  });





let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function(){
  console.log("Server listening on port " + port);
});
