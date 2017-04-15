import crypto from 'crypto';
import _ from 'lodash';
import mongoose, { Schema } from '../libs/mongoose';

/**
 * Check email by unique
 *
 * @param  {String} email
 * @param  {Function} respond - callback with bool result of check
 */
const isEmailUnique = function (email, respond) {
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
export const isUsernameUnique = function (username, respond) {
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

		validate: {
			validator: isEmailUnique,
			message: 'Email is already existing',
		},
	},

	username: {
		type: String,
		trim: true,
		required: true,

		validate: {
			validator: isUsernameUnique,
			message: 'Username is already existing',
		},
	},

	fullName: {
		type: String,
		trim: true,
	},

	bio: {
		type: String,
		trim: true,
	},

	avatar: {
		type: Schema.Types.ObjectId,
		ref: 'Image',
	},

	hashedPassword: {
		type: String,
	},

	salt: {
		type: String,
	},
}, {
	timestamps: true,
});

schema.virtual('password')
	.set(function (password) {
		this._plainPassword = password;
		this.setSalt();
		this.hashedPassword = this.encryptPassword(password);
	})
	.get(function () {
		return this._plainPassword || '';
	});

/**
 * Set random salt
 */
schema.methods.setSalt = function () {
	this.salt = Math.random().toString();
};

/**
 * Encrypt password
 *
 * @param  {String} password
 * @return {String}
 */
schema.methods.encryptPassword = function (password) {
	return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

/**
 * Check password
 *
 * @param  {String}
 * @return {Bool}
 */
schema.methods.checkPassword = function (password = '') {
	return this.encryptPassword(password) === this.hashedPassword;
};

schema.methods.formatToClient = function (callback) {
	this.populate('avatar')
		.execPopulate()
		.then(
			user => callback(null, user.toObject({ avatar: {} })),
			err => callback(err),
		);
};

/**
 * Search user by username
 *
 * @param  {String}   username
 * @param  {Function} callback
 */
schema.statics.findByUsername = function (username, callback) {
	return this.findOne({ username }, callback);
};

/**
 * Update user instance
 *
 * @param  {User}   user     instance of user model
 * @param  {Object}   data     new data
 * @param  {Function} callback
 */
schema.statics.updateInstance = function (user, data, callback) {
	return this.findByIdAndUpdate(user._id, data, { new: true }, callback);
};

if (!schema.options.toObject) schema.options.toObject = {};
schema.options.toObject.transform = function (doc, ret, options) {
	/* eslint-disable no-param-reassign */
	delete ret.salt;
	delete ret.hashedPassword;
	delete ret.updatedAt;
	delete ret.createdAt;

	if (options.avatar && _.isObject(doc.avatar)) {
		ret.avatar = doc.avatar.toObject(_.assign({}, options.avatar));
	}

	/* eslint-enable no-param-reassign */
	return ret;
};

const User = mongoose.model('User', schema);

export default User;
