import mongoose, { Schema } from '../libs/mongoose';

const contentSchema = new Schema({
	name: {
		type: String,
	},

	text: {
		type: String,
	},
}, {
	_id: false,
});

const schema = new Schema({
	publishContent: contentSchema,
	draftContent: contentSchema,

	firstPublishedDate: {
		type: Date,
	},

	lastPublishedDate: {
		type: Date,
	},

	lastEditedDate: {
		type: Date,
	},

	isPublished: {
		type: Boolean,
		default: false,
	},

	hasUnpublishedChanges: {
		type: Boolean,
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
 * Publish story
 *
 * @param  {Function} callback
 */
schema.methods.publish = function (callback) {
	this.publishContent = this.draftContent;
	this.lastPublishedDate = new Date();
	this.hasUnpublishedChanges = false;

	if (!this.isPublished) {
		this.firstPublishedDate = this.lastPublishedDate;
		this.isPublished = true;
	}

	this.save((err) => {
		if (err) {
			return callback(err);
		}

		return callback(null, this);
	});
};

/**
 * Edit story instance
 *
 * @param  {Object}   data      new data
 * @param  {Function} callback
 */
schema.methods.edit = function (data, callback) {
	this.draftContent = data;
	this.lastEditedDate = new Date();

	if (this.isPublished) {
		this.hasUnpublishedChanges = true;
	}

	this.save((err) => {
		if (err) {
			return callback(err);
		}

		return callback(null, this);
	});
};

/**
 * Get list of publications for one user
 *
 * @param  {String}   authorId identify of story's author
 * @param  {Function} callback
 */
schema.statics.getPublicationsByAuthorId = function (authorId, callback) {
	return this.find({ _author: authorId, isPublished: true }, callback);
};

/**
 * Get list of drafts for one user
 *
 * @param  {String}   authorId identify of story's author
 * @param  {Function} callback
 */
schema.statics.getDraftsByAuthorId = function (authorId, callback) {
	return this.find({ _author: authorId, isPublished: false }, callback);
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
	return this.create({
		draftContent: { text, name },
		_author: author._id,
		lastEditedDate: new Date(),
	}, callback);
};

if (!schema.options.toObject) schema.options.toObject = {};
schema.options.toObject.transform = function (doc, ret) {
	delete ret.updatedAt;
	delete ret.createdAt;
	delete ret._author;

	return ret;
};

const Story = mongoose.model('Story', schema);

export default Story;
