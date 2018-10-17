const mongoose= require('mongoose');

const validator = require('validator')
const Schema = mongoose.Schema;
const bcrypt= require('bcryptjs');
const jwt=require('jsonwebtoken');
const {cartItemSchema} = require('./cart_item')


const userSchema = new Schema({
    username:{
        type:String,
        min:4,
        max:64,
        unique:true,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        //validate property is used for defining our own validations
        validate:{
            validator:function(value){
                //return always false to throw a validation error
                 return validator.isEmail(value);
            }
        },
        message:function(){
            return 'invalid email format';
        }
    },
    password:{
         type:String,
         minlength:8,
         maxlength:128,
         required:true
    },
    tokens: [{
        token:{
            type:String
        }
    }],
    role : {
        type : String,
        required : true,
        enum : ['admin','customer'],
        default : 'customer'
    },
    cartItems:[cartItemSchema],
    wishListItems:[{
        product:{type:Schema.Types.ObjectId,ref:"Product"},
        createdAt:{type:Date,default:Date.now},
        isPublic:{type:Boolean,default:false}
    }]
});

userSchema.pre('save',function(next){
    let user = this;
    bcrypt.genSalt(10).then((salt)=>{
         bcrypt.hash(user.password,salt).then((hashed)=>{
             user.password=hashed;
             next();
         })
})
})

userSchema.methods.shortInfo = function(){
    return {
        _id:this,
        username:this.username,
        email:this.email
    }
}

userSchema.methods.generateToken = function(){
    let user = this;
    let tokenData = {
        _id:user.id
    };

    let token = jwt.sign(tokenData,'supersecret');
    user.tokens.push({
        token
    })

    return user.save().then(()=>{
        return token;
    })
}

userSchema.statics.findByToken = function(token){
    let User = this;
    let tokenData;
    try{
        tokenData = jwt.verify(token,'supersecret');
    }catch(e){
        return Promise.reject(e);
    }

    return User.findOne({
        '_id':tokenData,
        'tokens.token':token
    }).then((user)=>{
        if(user){
            return Promise.resolve(user);
        }else{
            return Promise.reject(user);
        }
    })
}

const User = mongoose.model('User',userSchema);
//let user = new User({username:'sravya',email:'sravya@dctacademy.com',password:'secret123'});

module.exports={
    User
}
// user.save().then((user)=>{
//     console.log(user);
// }).catch((err)=>{
//     console.log(err)
// });