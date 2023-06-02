const User = require('../models/user');
const Cart = require('../models/cart');
const express = require('express');
const router = new express.Router();
const { auth } = require('../middleware/auth');

//Creating user
router.post('/user', async (req, res) => {
	const user = new User(req.body);
	const cart = new Cart({
		shopper : user._id,
		items   : [
			{}
		]
	});
	try {
		await cart.save();
		await user.save();
		const token = await user.generateAuthToken();
		res.status(201).send({ user, cart, token });
	} catch (e) {
		res.status(401).send(e);
	}
});

//Logging user in
router.post('/user/login', async (req, res) => {
	try {
		const user = await User.findByCredentials(req.body.email, req.body.password);

		const token = await user.generateAuthToken();

		const cart = await Cart.findOne({ shopper: user._id });
		res.status(200).send({ user, cart, token });
	} catch (e) {
		res.status(400).send(e);
	}
});

//show user profile
router.get('/user/me', auth, async (req, res) => {
	try {
		res.status(200).send(req.user);
	} catch (e) {
		res.status(400).send(e);
	}
});

//logging out
router.post('/user/logout', auth, async (req, res) => {
	try {
		req.user.tokens = req.user.tokens.filter((uts) => {
			uts.token != req.token;
		});
		await req.user.save();
		res.status(200).send();
	} catch (e) {
		res.status(400).send(e);
	}
});

//Updating
router.patch('/user/update', auth, async (req, res) => {
	const allowedUpdates = [
		'name',
		'password',
		'email',
		'address'
	];
	const updates = Object.keys(req.body);
	const isValid = updates.every((update) => allowedUpdates.includes(update));

	if (!isValid) throw new Error('not a valid update');

	try {
		updates.forEach((update) => {
			req.user[update] = req.body[update];
		});

		await req.user.save();
		res.status(200).send(req.user);
	} catch (e) {
		res.status(400).send(e);
	}
});

//deleting user
router.delete('/user/delete', auth, async (req, res) => {
	try {
		await req.user.deleteOne();
		res.status(200).send(req.user);
	} catch (e) {
		res.status(500).send({ error: e });
	}
});
module.exports = router;
