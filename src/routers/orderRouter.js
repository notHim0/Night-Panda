const Order = require('../models/order');
const Product = require('../models/product');
const { auth } = require('../middleware/auth');
const express = require('express');
const router = new express.Router();

router.post('/order', auth, async (req, res) => {
	await req.user.populate({
		path : 'cart'
	});
	const cart = req.user.cart[0];
	const order = new Order({
		items     : [
			...cart.items
		],
		accountId : req.user._id,
		bill      : cart.bill
	});
	try {
		await order.save();
		for (let i = 1; i <= cart.count; i++) {
			const product = await Product.findOne({ _id: cart.items[i].item });

			if (product.quantity - cart.items[i].quantity < 0) {
				throw new Error('Out of stock');
			}
			product.quantity -= cart.items[i].quantity;
		}
		res.send(order);
	} catch (e) {
		res.status(400).send(e);
	}
});

router.get('/order/me', auth, async (req, res) => {
	try {
		const orders = await Order.find({ accountId: req.user._id });
		res.status(200).send(orders);
	} catch (e) {
		res.status(400).send(e);
	}
});
module.exports = router;
