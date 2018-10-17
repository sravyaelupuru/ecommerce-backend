//const {mongoose} = require('../../config/db');
const mongoose=require('mongoose')
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name:{
        type:String,
        required:true //server side validation
    }
});

const Category = mongoose.model('Category',categorySchema);

module.exports={
    Category
}

//let category = new Category({name:'Electronics'});

/*category.save().then((category)=>{
    console.log(category);
}).catch((err)=>{
    console.log(err);
})*/

//  Category.find().then((categories)=>{
//     console.log(categories);
//  }).catch((err)=>{
//      console.log(err);
// })

// Category.find({name:'furniture'}).then((categories)=>{
//     console.log(categories);
// }).catch((err)=>{
//     console.log(err);
// })


// Category.find({name:''}).then((categories)=>{
//     console.log(categories);
// }).catch((err)=>{
//     console.log(err);
// })

// Category.findOne({name:''}).then((category)=>{
//     console.log(category);
// }).catch((err)=>{
//     console.log(err);
// })


// Category.findOne({name:'furniture'}).then((category)=>{
//     console.log(category);
// }).catch((err)=>{
//     console.log(err);
// })

// Category.findOne({name:''}).then((category)=>{
//     if(category){
//     console.log(category);
//     }else{
//         console.log('no category found')
//     }
// }).catch((err)=>{
//     console.log(err);
// })

// Category.findById('5ba218b90f1a222780f3e63d').then((category) =>{
//     console.log(category);
// }).catch((err)=>{
//     console.log(err);
// })

// Category.findOneAndUpdate({ _id:'5ba0f444fe0f2f3974a24201'},{$set:{ name : 'gardening and manure'}},{ new:true }).then((category)=>{
//        console.log(category);
// }).catch((err)=>{
//     console.log(err);
// })

// Category.find().then((categories)=>{
//          console.log('Listing of categories'+categories.length);
//          for(var i=0;i<categories.length;i++){
//                console.log(i+1+'.'+categories[i].name);
//              }
         
//       }).catch((err)=>{
//         console.log(err);
//     })

    // Category.findOneAndUpdate({ _id:'5ba0f444fe0f2f3974a24201'},{$set:{ name : 'groceries'}},{ new:true }).then((category)=>{
    //           console.log(category);
    //     }).catch((err)=>{
    //         console.log(err);
    //     })
    

    //it runs and add to the database but the validations at save method doesnt apply here to apply validations we put runValidators  
    // Category.findOneAndUpdate({ _id:'5ba0f444fe0f2f3974a24201'},{$set:{ name : ''}},{ new:true,runValidators:true }).then((category)=>{
    //           console.log(category);
    //     }).catch((err)=>{
    //         console.log(err);
    //     })
      
   
// Category.findByIdAndDelete({ _id:'5ba0f444fe0f2f3974a24201'}).then((category)=>{
//     console.log(category);
// }).catch((err)=>{
//  console.log(err);
// })




