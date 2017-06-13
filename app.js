const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//set public folder
app.use(express.static(path.join(__dirname,'public')));

app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'pug');

mongoose.connect('mongodb://localhost/nodekb');
let db = mongoose.connection;

db.once('open', ()=>{
  console.log('connected to mongodb');
});

db.on('error',(err)=>{
  console.log(err);
});

let Article = require('./models/article');

app.get('/', (req,res)=> {

  Article.find({}, (err,articles) => {
    if(err){
      console.log(err);
    }
    else{
      res.render('index', {
        judul:'Article',
        articles:articles
      });
    }

  });
});

app.get('/articles/add', (req,res)=> {
  res.render('add_article', {judul:'Article'});
});

//add submit POST Route
app.post('/articles/add',(req,res)=>{
  let article = new Article();
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;
  article.save((err)=>{
    if(err){
      console.log(err);
    }
    else{
      res.redirect('/');
    }
  });
});

//get Single Article
app.get('/article/:id',(req,res)=>{
  Article.findById(req.params.id, (err,article)=>{
    res.render('article',{
      article:article
    })
  });
});

//load edit form
app.get('/article/edit/:id',(req,res)=>{
  Article.findById(req.params.id, (err,article)=>{
    res.render('edit_article',{
      article:article
    })
  });
});

//edit article POST
app.post('/articles/edit/:id',(req,res)=>{
  let article = {};
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  let query = {_id:req.params.id};

  Article.update(query,article,(err)=>{
    if(err){
      console.log(err);
    }
    else{
      res.redirect('/');
    }
  });
});

//delete article ajax
app.delete('/article/:id',(req,res)=>{
  let query = {_id:req.params.id};
  Article.remove(query,(err)=>{
    if(err){
      console.log(err);
    }
    res.send('Success');
  });
});


app.listen(3000, ()=>{
  console.log('sever started on port 3000');
});
