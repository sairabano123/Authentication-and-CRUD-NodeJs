
//Tasks:
//Connect the app with mongo db.
//Create different routes to create, update and delete user.



var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
const User = require('./models/userModel');

const uri = "mongodb+srv://nodejslearning:%40Sl123456@cluster0.yikzlt0.mongodb.net/?retryWrites=true&w=majority";
var express = require('express');
const bodyParser = require('body-parser');
//bycrypt password
var bcrypt = require('bcryptjs');
var app = express();
router.use(bodyParser.json());

async function connect() {
try{
  await mongoose.connect(uri);
  console.log('Connected to Database');
}
catch(error){
  console.log('Error: ', error);
}
}

connect();


//add user
router.post('/adduser', function(req, res, next) {
  try {
    const user =  User.create(req.body);

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

//update user
router.put('/updateuser/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, number } = req.body;
    // const user = await User.findById(id);
    await User.findByIdAndUpdate(id, { name, email, number });
    res.json('User updated successfully');
  } catch (error) {
    res.status(500).json({error});
  }
});

//Delete user
router.delete('/deleteuser/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await User.findByIdAndRemove(id);
    res.json('User deleted successfully');
  } catch (error) {
    res.status(500).json({error});
  }
});
// Create a user
// router.get('/adduser', (req, res) => {
//   res.send(req.body);

// });
/* GET home page. */
router.get('/', function(req, res, next) {
  res.send({ title: 'Express' });
});

module.exports = router;
