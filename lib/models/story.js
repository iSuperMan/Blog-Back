import _ from 'lodash';
import mongoose, { Schema } from '../libs/mongoose';

const contentSchema = new Schema({
	name: {
		type: String,
	},

	text: {
		type: String,
	},

	cover: {
		type: Schema.Types.ObjectId,
		ref: 'Image',
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

	tags: [String],

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
	const contentData = _.pick(data, ['name', 'text', 'cover']);

	if (!_.isEqual(
		_.transform(
			_.omit(this.draftContent, _.isUndefined).toObject(),
			(res, val, key) => { res[key] = val.toString(); },
			{},
		),

		contentData,
	)) {
		this.draftContent = contentData;
		this.lastEditedDate = new Date();

		if (this.isPublished) {
			this.hasUnpublishedChanges = true;
		}
	}

	if (data.tags) {
		this.tags = data.tags;
	}

	this.save((err) => {
		if (err) {
			return callback(err);
		}

		return callback(null, this);
	});
};

schema.methods.formatToClient = function (callback) {
	this
		.populate('draftContent.cover')
		.populate('publishContent.cover')
		.execPopulate()
		.then(
			story => callback(null, story.toObject({
				draftContent: { cover: {} },
				publishContent: { cover: {} },
			})),

			err => callback(err),
		);
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
schema.statics.createInstance = function ({ text, name, cover, tags, author }, callback) {
	return this.create({
		draftContent: { text, name, cover },
		tags,
		_author: author._id,
		lastEditedDate: new Date(),
	}, callback);
};

if (!schema.options.toObject) schema.options.toObject = {};
schema.options.toObject.transform = function (doc, ret, options) {
	delete ret.updatedAt;
	delete ret.createdAt;
	delete ret._author;

	if (options.cover && _.isObject(doc.cover)) {
		ret.cover = doc.cover.toObject(_.assign({}, options.cover));
	}

	if (options.draftContent && _.isObject(doc.draftContent)) {
		if (options.draftContent.cover && _.isObject(doc.draftContent.cover)) {
			ret.draftContent.cover = doc.draftContent.cover.toObject(
				_.assign({}, options.draftContent.cover),
			);
		}
	}

	if (options.publishContent && _.isObject(doc.publishContent)) {
		if (options.publishContent.cover && _.isObject(doc.publishContent.cover)) {
			ret.publishContent.cover = doc.publishContent.cover.toObject(
				_.assign({}, options.publishContent.cover),
			);
		}
	}

	return ret;
};

const Story = mongoose.model('Story', schema);

export default Story;
