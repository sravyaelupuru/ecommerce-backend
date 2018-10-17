const express = require('express');
const app = express();
const {mongoose} = require('./config/db');
var bodyParser = require('body-parser');

const {routes} = require('./config/routes');
const port=3000;
app.use(bodyParser.json()); 
app.use(express.json());

//middlewares
app.use('/',routes);

// app.get('/',(req,res) =>{
//     res.send('welcome to our site');
// })

// app.get('/account/orders',(req,res) =>{
//  res.send('here is the list of your order');
// });

// app.get('/categories',(req,res)=>{
//     Category.find().then((categories)=>{
//         res.send(categories);
//     }).catch((err)=>{
//         res.send(err);
//     })
// })
app.listen(port,()=>{
    console.log('listening on port',port);
})