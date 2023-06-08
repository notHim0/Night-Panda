const Cart = require('../models/cart');
const Product = require('../models/product');
const express = require('express');
const { auth } = require('../middleware/auth');
const router = new express.Router();

router.post('/cart/add/:id', auth, async (req, res) => {
	try {
		//push items
		const cart = await Cart.findOne({ shopper: req.user._id });
		const product = await Product.findById(req.params.id);
		cart.items = cart.items.concat({ item: req.params.id, quantity: req.query.quantity });
		cart.bill += product.price * req.query.quantity;
		cart.count += 1;
		await cart.save();

		res.send(cart);
	} catch (e) {
		res.status(400).send();
	}
});

router.get('/cart/list', auth, async (req, res) => {
	try {
		await req.user.populate({
			path : 'cart'
		});
		res.status(201).send(req.user.cart);
	} catch (e) {
		res.status(400).send(e);
	}
});

router.delete('/cart/remove-all', auth, async (req, res) => {
	try {
		await Cart.deleteMany({ shopper: req.user._id });
		res.status(200).send('Deleted');
	} catch (e) {
		res.status(400).send(e);
	}
});

module.exports = router;
