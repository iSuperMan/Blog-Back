import crypto from 'crypto';
import validator from 'validator';
import mongoose, { Schema } from '../libs/mongoose';

/**
 * Check email by unique
 *
 * @param  {String} email
 * @param  {Function} respond - callback with bool result of check
 */
const isEmailUnique = function bar(email, respond) {
	/* eslint-disable no-use-before-define */
	User.findOne({ email }, (err, user) => {
		if (err || (user && user.id !== this.id)) {
			return respond(false);
		}

		return respond(true);
	});
	/* eslint-enable no-use-before-define */
};

/**
 * Check username by unique
 *
 * @param  {String} username
 * @param  {Function} respond - callback with bool result of check
 */
export const isUsernameUnique = function bar(username, respond) {
	/* eslint-disable no-use-before-define */
	User.findOne({ username }, (err, user) => {
		if (err || (user && user.id !== this.id)) {
			return respond(false);
		}

		return respond(true);
	});
	/* eslint-enable no-use-before-define */
};

const schema = new Schema({
	email: {
		type: String,
		trim: true,
		required: true,

		validate: [
			{
				validator: val => validator.isEmail(val),
				message: 'Invalid `{PATH}` value ("{VALUE}")',
			},

			{
				validator: isEmailUnique,
				message: 'Email is already existing',
			},
		],
	},

	username: {
		type: String,
		trim: true,
		required: true,
		maxlength: [20, 'Length should be not more than 20 characters'],
		minlength: [5, 'Length should be not less than 5 characters'],

		match: [
			/^[a-z0-9._]+$/,
			'Not allowed charaters in `{PATH}`',
		],

		validate: {
			validator: isUsernameUnique,
			message: 'Username is already existing',
		},
	},

	fullName: {
		type: String,
		trim: true,
	},

	hashedPassword: {
		type: String,
		default: '', // run validation
	},

	salt: {
		type: String,
	},
}, {
	timestamps: true,
});

schema.virtual('password')
	.set(function bar(password) {
		this._plainPassword = password;
		this.setSalt()
		this.hashedPassword = this.encryptPassword(password)
	})
	.get(function() {
		return this._plainPassword || '';
	})

/*
   virtual fields do not provide a validation,
   cause we handle the validator on 'hashedPassword' and
   assign errors to 'password' virtual field
 */
schema.path('hashedPassword').validate(function() {
	const { isNew , _plainPassword } = this

	if (isNew) {
		if (!_plainPassword) {
			this.invalidate('password', 'Password is required')
		} else if(_plainPassword.length < 5) {
			this.invalidate('password', 'Password length should be not less than 5 characters')
		} else if(_plainPassword.length > 20) {
			this.invalidate('password', 'Password length should be not more than 20 characters')
		}
	}
}, null)

/**
 * Set random salt
 */
schema.methods.setSalt = function() {
	this.salt = Math.random() + ''
}

/**
 * Encrypt password
 *
 * @param  {String} password
 * @return {String}
 */
schema.methods.encryptPassword = function(password) {
	return crypto.createHmac('sha1', this.salt).update(password).digest('hex')
}

/**
 * Check password
 *
 * @param  {String}
 * @return {Bool}
 */
schema.methods.checkPassword = function(password) {
	return this.encryptPassword(password) === this.hashedPassword
}

if (!schema.options.toObject) schema.options.toObject = {};
schema.options.toObject.transform = function bar(doc, ret) {
	/* eslint-disable no-param-reassign */
	delete ret.salt;
	delete ret.hashedPassword;
	delete ret.updatedAt;
	delete ret.createdAt;

	/* eslint-enable no-param-reassign */
	return ret;
};

const User = mongoose.model('User', schema);

export default User;