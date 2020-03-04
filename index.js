const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcryptjs = require('bcryptjs');
const config = require('./config.json');
const product = require('./products.json') // external json data from mockaroo
const dbProduct = require('./models/products.js');
const User = require('./models/users.js');

const port = 3000;
//connect to db
// const mongodbURI = 'mongodb+srv://rubylowry:okiDOKES77@rubydatabase-lrehb.mongodb.net/test?retryWrites=true&w=majority';
const mongodbURI = `mongodb+srv://${config.MONGO_USER}:${config.MONGO_PASSWORD}@${config.MONGO_CLUSTER_NAME}.mongodb.net/test?retryWrites=true&w=majority`;
mongoose.connect(mongodbURI, {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=> console.log('DB connected!'))
.catch(err =>{
  console.log(`DBConnectionError: ${err.message}`);
});
//test the connectivity
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('We are connected to mongo db');
});

app.use((req, res, next)=>{
  console.log(`${req.method} request for ${req.url}`);
  next();//include this to go to the next middleware
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extreme:false}));

app.use(cors());

app.get('/', (req, res) => res.send('Hello World!'))

// if the user requests for all products this show everything in file

app.get('/allProducts', (req,res)=>{
  res.json(product);

});

app.get('/products/p=:id', (req,res)=>{
  const idParam = req.params.id;

  for (let i = 0; i < product.length; i++){

    if (idParam.toString() === product[i].id.toString()) {
       res.json(product[i]);
    }
  }

});


//register user
app.post('/registerUser', (req,res)=>{

  User.findOne({username:req.body.username},(err,userResult)=>{
    if (userResult){
      res.send('username taken already. Please try another one');
    } else{
      const hash = bcryptjs.hashSync(req.body.password);
       const user = new User({
         _id : new mongoose.Types.ObjectId,
         username : req.body.username,
         email : req.body.email,
         password :hash
       });

       user.save().then(result =>{
         res.send(result);
       }).catch(err => res.send(err));
    }

  })


});


// hash sync
// compare sync
//get all user
app.get('/allUsers', (req,res)=>{
  User.find().then(result =>{
    res.send(result);
  })

});

//login the user
app.post('/loginUser', (req,res)=>{
  User.findOne({username:req.body.username},(err,userResult)=>{
    if (userResult){
      if (bcryptjs.compareSync(req.body.password, userResult.password)){
        res.send(userResult);
      } else {
        res.send('not authorized');
      }//inner if
    } else {
       res.send('user not found. Please register');
    }//outer if
  });//findOne
});//post


// keep this at the bottom of code so you can always see any errors

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
