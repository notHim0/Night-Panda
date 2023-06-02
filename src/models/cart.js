const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
	items   : [
		{
			item     : {
				type : mongoose.ObjectId
			},
			quantity : {
				type     : Number,
				validate(value) {
					if (value < 1) throw new Error('Add item');
				}
			}
		}
	],
	bill    : {
		type    : Number,
		default : 0
	},
	count   : {
		type    : Number,
		default : 0
	},
	shopper : {
		type     : mongoose.Schema.Types.ObjectId,
		required : true,
		ref      : 'User'
	}
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
