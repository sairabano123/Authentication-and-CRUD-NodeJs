const express = require('express')
const app = express()
const port = 3000


app.use('/login',(req,res,next)=>{
    console.log('Function one', Date.now());
    if(req.url=='/hi'){
        res.send('blocked, through middleware');
    }
    else{
    next();
    }
},(req,res,next)=>{
    console.log('Function two', Date.now());
    next();
} )


app.get('/', (req, res) => {
  res.send('Hellao World!')
})

// app.get('/hi', (req, res) => {
//     res.send('Hellao World!')
//   })

app.get('/user/:id', (req, res) =>{
    console.log('id',req.params.id);
res.send(req.params.id);
})

app.use((req,res,next)=>{
    console.log('Time', Date.now())
    next()
})

app.listen(port, () => {
  console.log(`Examplee appa listening on port ${port}`)
})