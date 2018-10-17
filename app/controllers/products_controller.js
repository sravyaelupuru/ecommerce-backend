const express = require('express');
const {Product} = require('../models/product');
const {validateID}=require('../middlewares/utilities');
const {authenticateUser,authorizeUser} = require('../middlewares/authentication');
const router = express.Router();


router.get('/',(req,res)=>{
       Product.find().then((products) =>{
               res.send(products);
       }).catch((err)=>{
           res.send(err);
       })
});

router.get('/:id' ,validateID,(req,res) =>{
    let id=req.params.id;
    Product.findById(id).then((product) =>{
        res.send(product);
    }).catch((err)=>{
        res.send(err);
    })

})

router.post('/',authenticateUser,authorizeUser,(req,res) =>{
    let body=req.body;
    let product = new Product(body);
    product.save().then((product) =>{
        res.send({
            product,
            notice:`Successfully created product`
        })
    }).catch((err) =>{
        res.send(err);
    });
});


router.put('/:id',validateID,authenticateUser,authorizeUser,(req,res)=>{
    let id=req.params.id;
    let body=req.body;
      Product.findByIdAndUpdate({_id:id},{$set:body},{new:true,
        runValidators:true}).then((product)=>{
            if(!product){
                res.send({
                    notice:'product not found'
                })
            }
                res.send({
                    product,
                    notice:'Successfully updated the product'
                })
            }).catch((err)=>{
                res.send(err);
            })
})


router.delete('/:id',validateID,authenticateUser,authorizeUser,(req,res)=>{
    let id=req.params.id;
    Product.findByIdAndRemove(id).then((product)=>{
        if(product){
            res.send(product);
        }else{
            res.send({
                notice:'Product not found'
            })
        }
    })
})

module.exports={
    productsController:router
}