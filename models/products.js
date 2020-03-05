const mongoose = require('mongoose'); // since we are using mongoose we have to require it

const  productSchema = new mongoose.Schema({
  _id : mongoose.Schema.Types.ObjectId,
  productName : String,
  price : Number,
  imageURL : String
});

module.exports = mongoose.model('Product', productSchema);
