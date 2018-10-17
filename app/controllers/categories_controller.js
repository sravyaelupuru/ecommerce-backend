const express = require('express');
const {validateID} = require('../middlewares/utilities');
const _ = require('lodash');
const {authenticateUser,authorizeUser} = require('../middlewares/authentication')
const { Category } = require('../models/category');
const {Product} = require('../models/product')

const router = express.Router();


// localhost:3000/categories/
router.get('/', (req, res) => {
    Category.find().then((categories) => {
        res.send(categories); 
    }).catch((err) => {
        res.send(err); 
    });
});

// localhost:3000/categories/:id
router.get('/:id',validateID,(req, res) => {
    let id = req.params.id; 
    Category.findById(id).then((category) => {
        res.send(category); 
    }).catch((err)=>{
        console.log(err);
    })
});

router.post('/',authenticateUser,authorizeUser,(req,res)=>{
    let body=_.pick(req.body,['name']);
    let  category=new Category(body);
    category.save().then((category)=>{
        res.send({
            category,
            notice:'successfully created product'
        })
    }).catch((err)=>{
        res.send(err);
    })
})

router.put('/:id',validateID,authenticateUser,authorizeUser,(req,res)=>{
    let id=req.params.id;
    let body=req.body;
    Category.findByIdAndUpdate({_id:id},{$set:body},{new:true,
        runValidators:true}).then((category)=>{
            if(!category){
                res.send({
                    notice:'category not found'
                })
            }
            res.send({
                category,
                notice:'successfully updated'
            })
        })
})

router.delete('/:id',validateID,authenticateUser,authorizeUser,(req,res)=>{
    let id=req.params.id;
    Category.findByIdAndRemove(id).then((category)=>{
        if(category){
            res.send(category);
           
        }else{
        res.send({
            notice:'category not found'
        })
    }
    })
})

router.get('/:id/products',validateID,(req,res)=>{
    let id=req.params.id;
    Product.findByCategory(id).populate('category','name').then((products)=>{
        res.send(products)
    }).catch((err)=>{
        res.send(err);
    })
})

module.exports={
    categoriesController:router
}