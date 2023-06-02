const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
	{
		accountId : {
			type : mongoose.ObjectId
		},
		items     : [],
		bill      : {
			type : Number
		}
	},
	{
		timestamps : true
	}
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
