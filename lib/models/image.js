import path from 'path';
import fs from 'fs';
import mongoose, { Schema } from '../libs/mongoose';

const schema = new Schema({
	path: {
		type: String,
		required: true,
	},

	_uploadedBy: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
}, {
	timestamps: true,
});

schema.post('remove', (image, next) => {
	const rootDir = path.dirname(require.main.filename);
	const filePath = path.resolve(rootDir, '../', image.path);

	fs.unlink(filePath, next);
});

/**
 * Create new instance
 *
 * @param  {String}   filePath file to path
 * @param  {User}   user     instance of user model
 * @param  {Function} callback
 */
schema.statics.createInstance = function ({ filePath, user }, callback) {
	return this.create({ path: filePath, _uploadedBy: user._id }, callback);
};

if (!schema.options.toObject) schema.options.toObject = {};
schema.options.toObject.transform = function (doc, ret) {
	delete ret.updatedAt;
	delete ret.createdAt;
	return ret;
};

const Image = mongoose.model('Image', schema);

export default Image;
