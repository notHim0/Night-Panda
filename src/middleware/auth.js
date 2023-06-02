const jwt = require('jsonwebtoken');
const User = require('../models/user');

//Checking if user if logged in or not
const auth = async function(req, res, next) {
	try {
		const token = req.header('Authorization').replace('Bearer ', '');
		const decoded = jwt.verify(token, 'nightpanda');
		const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

		if (!user) throw new Error();

		req.user = user;
		next();
	} catch (e) {
		res.status(401).send({ error: 'Please authenticate' });
	}
};

//restricting basic users reach
const roleAuth = function(req, res, next) {
	try {
		if (req.user.role === 'basic') {
			throw new Error('Access Denied');
		}
		next();
	} catch (e) {
		res.status(401).send({ error: 'Access Denied' });
	}
};

module.exports = { auth, roleAuth };
