const Product = require('../models/product');
const express = require('express');
const router = new express.Router();
const { auth, roleAuth } = require('../middleware/auth');

//Adding products to inventory
router.post('/product', auth, roleAuth, async (req, res) => {
	const product = new Product(req.body);
	try {
		await product.save();
		res.status(201).send(product);
	} catch (e) {
		res.status(400).send();
	}
});

//Listing all the products in the inventory
router.get('/product/list', auth, roleAuth, async (req, res) => {
	try {
		const task = await Product.find({});
		res.status(200).send(task);
	} catch (e) {
		res.status(400).send(e);
	}
});

//Updating products
router.patch('/product/update/:id', auth, roleAuth, async (req, res) => {
	const product = await Product.findById(req.params.id);
	if (!product) throw new Error('Invalid Product Id');

	const updates = Object.keys(req.body);
	const allowedUpdates = [
		'name',
		'price',
		'quantity'
	];
	const isValid = updates.every((update) => allowedUpdates.includes(update));

	if (!isValid) throw new Error('Not a valid update');

	try {
		updates.forEach((update) => {
			product[update] = req.body[update];
		});

		await product.save();
		res.status(200).send(product);
	} catch (e) {
		res.status(400).send(e);
	}
});

//Removing products
router.delete('/product/remove/:id', auth, roleAuth, async (req, res) => {
	try {
		const product = await Product.findOneAndDelete({ _id: req.params.id });
		if (!product) throw new Error('Enter a valid product id');
		res.send(product);
	} catch (e) {
		res.status(400).send(e);
	}
});

module.exports = router;
