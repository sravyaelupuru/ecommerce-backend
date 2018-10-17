const express = require('express');
const router = express.Router();
const _= require('lodash');
const {User} = require('../models/user');
const {CartItem} = require('../models/cart_item')
const {authenticateUser}=require('../middlewares/authentication');
const {validateID} = require('../middlewares/utilities')

router.post('/',(req,res)=>{
    //let body=req.body;

    let body = _.pick(req.body,['username','password','email']);

    //strong parameters
    // const body = {
    //     username:req.body.username,
    //     password:req.body.password,
    //     email:req.body.email
    // }
    let user = new User(body);
    user.save().then((user)=>{//-->before save controller  will go the pre save part
       return user.generateToken(); // call the instance method
    }).then((token)=>{
        res.header('x-auth',token).send(user.shortInfo());
    }).catch((err)=>{
        console.log(err);
    });
});


router.get('/cart_items',authenticateUser,(req,res)=>{
    //let user = req.locals.user;
    res.send(req.locals.user.cartItems)
});


//add to the cart
//POST users/cart_items
router.post('/cart_items',authenticateUser,(req,res)=>{
    let user = req.locals.user;
    let body =  _.pick(req.body,['product','quantity']);
    let cartItem = new CartItem(body);
    let inCart = user.cartItems.find((item)=>{
        //if you want to compare 2 object ids we need to use the equals method
         return item.product.equals(cartItem.product);
    })
    if(inCart){
         inCart.quantity = inCart.quantity+cartItem.quantity;
    }else{
        user.cartItems.push(cartItem);
    }
    
    user.save().then((user)=>{
        res.send({
            cartItem,
            notice:"successfully added to the cart"
        })
    }).catch((err)=>{
        res.send(err);
    })
})


//update the quantity
//PUT users/cart_items/:id

router.put('/cart_items/:id',validateID,authenticateUser,(req,res)=>{
    let cartItemId = req.params.id;
    let user = req.locals.user;
    let body=_.pick(req.body,['quantity']);
    let inCart =user.cartItems.id(cartItemId);
    inCart.quantity=body.quantity;
    user.save().then((user)=>{
        res.send({
            cartItem:inCart,
            notice:'Successfully update the quantity of the product'
        })
    }).catch((err)=>{
        res.send(err)
    })
})

//remove the product from the cart_item
//DELETE users/cart_items/:id

router.delete('/cart_items/:id',validateID,authenticateUser,(req,res)=>{
    let cartItemId = req.params.id;
    let user = req.locals.user;
    user.cartItems.id(cartItemId).remove();
    user.save().then((user)=>{
        res.send({
            notice:'successfully removed the product from the cart'
        })
    }).catch((err)=>{
        res.send(err);
    })
})


router.get('/wishlist_items',authenticateUser,(req,res)=>{
    //let user = req.locals.user;
    res.send(req.locals.user.wishListItems)
});


router.post('/wishlist_items',authenticateUser,(req,res)=>{
    let user = req.locals.user;
    let body =  _.pick(req.body,['product']);
    
    let inWishList = user.wishListItems.find((item)=>{
        //if you want to compare 2 object ids we need to use the equals method
         return item.product.equals(body.product);
    })
    if(inWishList){
         console.log('already in the wishlist')
    }else{
        user.wishListItems.push({product:body.product});
    }
    
    user.save().then((user)=>{
        res.send({
            product:body.product,
            notice:"successfully added to the wishlist"
        })
    }).catch((err)=>{
        res.send(err);
    })
})

router.get('/:name/wishlist_items',authenticateUser,(req,res)=>{
    let user = req.locals.user;
    User.findOne({ username: req.params.name, 'wishListItems.isPublic': req.query.isPublic }).then((user)=>{
       res.send((user.wishListItems[0].product));
    }).catch((err)=>{
        console.log(err);
    })
   
});

router.put('/removefromwishlist/addtocart/:id',validateID,authenticateUser,(req,res)=>{
    let wishItemId = req.params.id;
    let user = req.locals.user;
    let toCart =user.wishListItems.id(wishItemId);
    user.wishListItems.id(wishItemId).remove();
    let body =  _.pick(toCart,['product']);
    let cartItem = new CartItem(body);
    let inCart = user.cartItems.find((item)=>{
        //if you want to compare 2 object ids we need to use the equals method
         return item.product.equals(cartItem.product);
    })
    if(inCart){
         inCart.quantity = inCart.quantity+cartItem.quantity;
    }else{
        user.cartItems.push(cartItem);
    }
    
    user.save().then((user)=>{
        res.send({
            cartItem,
            notice:"successfully added to the cart"
        })
    }).catch((err)=>{
        res.send(err);
    })
})

router.delete('/wishlist_items/:id',validateID,authenticateUser,(req,res)=>{
    let wishListItemId = req.params.id;
    let user = req.locals.user;
    user.wishListItems.id(wishListItemId).remove();
    user.save().then((user)=>{
        res.send({
            notice:'successfully removed the product from the wishlist'
        })
    }).catch((err)=>{
        res.send(err);
    })
})






router.delete('/logout',authenticateUser,(req,res)=>{
    let user=req.locals.user;
    let token = req.locals.token;
    let activeToken  = user.tokens.find(function(inDbToken){
        return inDbToken.token == token;
  });
  user.tokens.id(activeToken._id).remove();
  user.save().then((user)=>{
      res.send();
  }).catch((err)=>{
      res.send(err);
  })
})



module.exports={
    usersController:router
}