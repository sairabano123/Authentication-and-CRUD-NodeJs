

//Tasks:
//Create a login route and validate user from DB and send JWT Token using JWT Package.
//Create a Middleware function to secure public routes.


var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const uri = "mongodb+srv://user:pass@cluster0.yikzlt0.mongodb.net/?retryWrites=true&w=majority";
const User = require('./models/userLoginModel');

//bycrypt password
var bcrypt = require('bcryptjs');

//jwt token
const jwt = require('jsonwebtoken');

const bodyParser = require('body-parser');
router.use(bodyParser.json());


//Connection to DB
async function connect() {
    try {
        await mongoose.connect(uri);
        console.log('Connected to Database');
    }
    catch (error) {
        console.log('Error: ', error);
    }
}

connect();

router.post('/register', async (req, res) => {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
    })
    try {
        const result = await user.save()

        //Separating password from data.
        const { password, ...data } = await result.toJSON()
        res.send(data)

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json(error);
    }
});


//Public Route Access
router.post('/login',async(req, res)=>{
    console.log(req.body);
    const user = await User.findOne({email: req.body.email})

    if (!user) {
        return res.status(404).send({
            message: 'user not found'
        })
    }

    //Validating Credentials
    if (!await bcrypt.compare(req.body.password, user.password)) {
        return res.status(400).send({
            message: 'invalid credentials'
        })
    }

    // Generate JWT token,store id in JWT token
    // jwt.sign({_id: user._id}, 'secretkey', { expiresIn: '2h' }, (err, token) => {
    //     res.json({
    //       token
    //     });
    // });


    const token = jwt.sign({_id: user._id}, "secret")

    res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    })

    res.send({
        message: 'success'
    })
});


router.get('/user', async (req, res) => {
    try {
        const cookie = req.cookies['jwt']

        const claims = jwt.verify(cookie, 'secret')

        if (!claims) {
            return res.status(401).send({
                message: 'unauthenticated'
            })
        }

        const user = await User.findOne({_id: claims._id})

        const {password, ...data} = await user.toJSON()

        res.send(data)
    } catch (e) {
        return res.status(401).send({
            message: 'unauthenticated'
        })
    }
})

router.post('/logout', (req, res) => {
    res.cookie('jwt', '', {maxAge: 0})

    res.send({
        message: 'success'
    })
})

//Bearer Method
//route to protect, calling middleware function verifyToken
// router.post('/posts', verifyToken, (req, res) => {
//     jwt.verify(req.token, 'secret', (err, authData) => {
//       if(err) {
//         res.sendStatus(403);
//       } else {
//         res.json({
//           message: 'Post created...',
//           authData
//         });
//       }
//     });
//   });


// // Verify Token
// function verifyToken(req, res, next) {
//     // Get auth header value
//      const bearerHeader = req.headers['authorization'];
//     console.log( req.headers);
//     // Check if bearer is undefined
//     if(typeof bearerHeader !== 'undefined') {
//       // Split at the space
//       const bearer = bearerHeader.split(' ');
//       // Get token from array
//       const bearerToken = bearer[1];
//       // Set the token
//       req.token = bearerToken;
//       // Next middleware
//       next();
//     } else {
//       // Forbidden
//       res.sendStatus(403);
//     }

//   }

module.exports = router;
