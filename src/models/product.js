const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
	name     : {
		type     : String,
		required : true,
		trim     : true
	},
	price    : {
		type     : Number,
		required : true
	},
	quantity : {
		type     : Number,
		required : true
	},
	rating   : {
		type : mongoose.Decimal128
	},
	img      : {
		type : Buffer
	}
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
