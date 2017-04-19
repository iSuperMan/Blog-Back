import _ from 'lodash';
import mongoose, { Schema } from '../libs/mongoose';

const schema = new Schema({
	name: {
		type: String,
	},

	text: {
		type: String,
	},

	_author: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
}, {
	timestamps: true,
});

/**
 * Check author of story
 *
 * @param  {User} author  user that could be author
 * @return {Boolean}      result of check
 */
schema.methods.checkAuthor = function (author) {
	if (!this.populated('_author')) {
		return this._author.toString() === author._id.toString();
	}

	return this._author._id.toString() === author._id.toString();
};

/**
 * Create new instance
 *
 * @param  {String}   text     main text of story
 * @param  {String}   name     name of story
 * @param  {User}     author   author of story
 * @param  {Function} callback
 */
schema.statics.createInstance = function ({ text, name, author }, callback) {
	return this.create({ text, name, _author: author._id }, callback);
};

/**
 * Update story instance
 *
 * @param  {Story}    story     instance of story model
 * @param  {Object}   data      new data
 * @param  {Function} callback
 */
schema.statics.updateInstance = function (story, data, callback) {
	return this.findByIdAndUpdate(story._id, data, { new: true }, callback);
};

if (!schema.options.toObject) schema.options.toObject = {};
schema.options.toObject.transform = function (doc, ret) {
	delete ret.updatedAt;
	delete ret.createdAt;
	return ret;
};

const Story = mongoose.model('Story', schema);

export default Story;
