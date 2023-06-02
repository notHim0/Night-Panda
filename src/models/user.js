const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

//desinging the User structure
const userSchema = new mongoose.Schema(
	{
		name         : {
			type     : String,
			required : true,
			trim     : true
		},
		email        : {
			type      : String,
			required  : true,
			trim      : true,
			lowercase : true,
			unique    : true,
			validate(value) {
				if (!validator.isEmail(value)) {
					throw new Error('Enter a valid email');
				}
			}
		},
		credit       : {
			type : Number
		},
		role         : {
			type    : String,
			default : 'basic'
		},
		password     : {
			type      : String,
			required  : true,
			minlength : 7
		},
		address      : {
			type : String,
			trim : true
		},
		order_placed : {
			type : Number
		},
		tokens       : [
			{
				token : {
					type : String
				}
			}
		]
	},
	{
		timestamps : true
	}
);

//linking cart and user
userSchema.virtual('cart', {
	ref          : 'Cart',
	localField   : '_id',
	foreignField : 'shopper'
});

//locking down credentials
userSchema.methods.toJSON = function() {
	const userObject = this.toObject();

	delete userObject.password;
	delete userObject.tokens;

	return userObject;
};
//generating user token
userSchema.methods.generateAuthToken = async function() {
	const user = this;

	const token = jwt.sign({ _id: user._id.toString() }, 'nightpanda');
	user.tokens = user.tokens.concat({ token });
	await user.save();
	return token;
};

//logging user in
userSchema.statics.findByCredentials = async function(email, password) {
	const user = await User.findOne({ email });
	if (!user) throw new Error('Unable to login');
	const isValidPassword = await bcrypt.compare(password, user.password);

	if (!isValidPassword) throw new Error('Unable to login');
	return user;
};
//hashing and saving user password
userSchema.pre('save', async function(next) {
	const user = this;

	if (user.isModified('password')) {
		user.password = await bcrypt.hash(user.password, 8);
	}
	return next();
});

//defining the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
