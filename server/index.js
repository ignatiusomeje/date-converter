const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path')
const {pick} = require('lodash');
const handlebars = require('hbs');

const {Users} = require('./models/Users');
const {Query} = require('./models/queries');
const {authenticate} = require('./middleware/authenticate');
const {convert} = require('./converter/converter');

mongoose.connect('mongodb://localhost:27017/dateConverter',{ useNewUrlParser: true });

const App = express();

handlebars.registerPartials(path.join(__dirname, '../views/partials'))
App.set('view engine', 'hbs');
App.use(express.static(path.join(__dirname, '../public')));
App.use(bodyParser.json());
App.use(bodyParser.urlencoded({extended: false}));

//creates new query
App.post('/query',authenticate, async (req, res)=>{
  const number = parseInt(req.body.number)
  try{
    const results = await convert(number,req.body.unit);
    if (!results){
      return e;
    }
    const query = new Query({
      number: req.body.number,
      unit: req.body.unit,
      results,
      creator: req.user._id
    });
    
    const result = await query.save();
    let values = result.toObject()
    let pickValues = pick(values,'results')
    res.status(200).send(pickValues);
  } catch(e){
    res.status(404).send('unable convert your data');
  }
});

//gets the whole query and its results
App.get('/history',authenticate, async (req, res) => {

  try{
    const queries = await Query.find({creator: req.user.
    _id}).sort({$natural:-1});
    res.status(200).send(queries);
  }catch(e){
    res.status(404).send('Unable to find your previous queries')
  }
})

//creates a new user
App.post('/user', async (req,res)=>{
  
  const user = new Users({
    username: req.body.username,
    password: req.body.password,
  });
  
  try{
    const token = await user.generateAuthenticationkey();
    const person = await user.save();
    res.send(person);
  }catch(e){
    res.status(400).render('user.hbs',{
      error: 'Unable to Create User'
    });
  }
})

//login a user
App.post('/login', async (req, res)=>{
  try{
    const user = await Users.verifyUser(req.body.username, req.body.password);
    const token = await user.generateAuthenticationkey();
    res.send(user);
  }catch(err){
    res.status(400).send(err);
  }
})
App.get('/', async (req, res)=>{
  
  try{
    res.render('index.hbs',{
      title: 'Sign IN'
    })
    
  }catch(err){
    res.status(400).send(err);
  }
})
App.get('/query', async (req, res)=>{
  try{
    res.render('converter.hbs',{
      title: 'Date Converter'
    })
    
  }catch(err){
    res.redirect('/');
  }
})

App.get('/user', async (req, res)=>{

  try{
    res.render('user.hbs',{
      title: 'Sign UP'
    })
    
  }catch(err){
    res.status(400).send(err);
  }
})

// log out a user
App.delete('/logout',authenticate, async (req, res) => {
  try{
    await req.user.signOut(req.token)
    res.status(200).send('you have successfully logged out')
  }catch(e){
    res.status(400).send('logging out unsuccessful');
  }
  
});

App.listen(3000,()=>{
  console.log('Your app is up on port 3000')
})