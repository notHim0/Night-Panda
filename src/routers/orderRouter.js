const Order = require('../models/order');
const Product = require('../models/product');
const { auth } = require('../middleware/auth');
const express = require('express');
const Cart = require('../models/cart');
const router = new express.Router();

//placing a order
router.post('/order', auth, async (req, res) => {
	await req.user.populate({
		path : 'cart'
	});
	let cart = req.user.cart[0];
	const order = new Order({
		items     : [
			...cart.items
		],
		accountId : req.user._id,
		bill      : cart.bill,
		count     : cart.count,
		status    : 'confirmed'
	});
	try {
		for (let i = 1; i <= cart.count; i++) {
			const product = await Product.findOne({ _id: cart.items[i].item });

			// if (product.quantity - cart.items[i].quantity < 0) {
			// 	throw Error('Out of stock');
			// }
			// product.quantity -= cart.items[i].quantity;
			await order.save();
			// await product.save();
		}
		//tried to empty cart(failed)
		// console.log(req.user.cart.items);

		// req.user.cart[items] = [];
		console.log(req.user.cart[0]._id);
		cart = await Cart.findOne({ _id: req.user.cart[0]._id });
		console.log(cart, 'fshdalfhjs');
		cart.items = [
			{}
		];
		await cart.save();

		res.send(order);
	} catch (e) {
		res.status(400).send({ error: e });
	}
});

//listing orders
router.get('/order/me', auth, async (req, res) => {
	try {
		const orders = await Order.find({ accountId: req.user._id });
		res.status(200).send(orders);
	} catch (e) {
		res.status(400).send(e);
	}
});

//canceling orders
router.patch('/order/cancel/:id', auth, async (req, res) => {
	const order = await Order.findById(req.params.id);

	try {
		order.status = 'canceled';
		await order.save();

		for (let i = 1; i < order.count; i++) {
			const product = await Product.findOne({ _id: order.items[i].item });

			product.quantity += order.items[i].quantity;

			await product.save();
		}
		res.send(order).status(200);
	} catch (e) {
		res.status(400).send(e);
	}
});
module.exports = router;
