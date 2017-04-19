import path from 'path';
import crypto from 'crypto';
import async from 'async';
import fs from 'fs';

export default (file, callback) => {
	const dir = 'public/';

	const extension = path.extname(file.originalname);

	const mainDir = path.resolve(path.dirname(require.main.filename), '../');
	const newPath = dir + crypto.randomBytes(16).toString('hex') + extension;
	const newFullPath = path.resolve(mainDir, newPath);
	const uploadFile = path.resolve(mainDir, file.path);

	async.waterfall([
		cb => fs.readFile(uploadFile, cb),
		(data, cb) => fs.writeFile(newFullPath, data, cb),
		cb => fs.unlink(uploadFile, cb),
	], (err) => {
		if (err) {
			return callback(err);
		}

		return callback(null, `/${newPath}`);
	});
};
