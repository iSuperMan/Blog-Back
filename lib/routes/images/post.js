import multer from 'multer';
import async from 'async';
import uploadImage from '../../libs/uploadImage';
import Image from '../../models/image';
import authControl from '../../middlewares/authControl';

const upload = multer({ dest: 'uploads/' });

export default [
	authControl,
	upload.single('image'),

	({ file, _auth }, res, next) => {
		async.waterfall([
			cb => uploadImage(file, cb),
			(filePath, cb) => Image.createInstance({ filePath, user: _auth }, cb),
		], (err, image) => {
			if (err) {
				return next(err);
			}

			return res.sendResponse({ image: image.toObject({}) });
		});
	},
];
