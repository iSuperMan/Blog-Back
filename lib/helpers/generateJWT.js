import jwt from 'jsonwebtoken';
import config from '../config';

export default (user, callback) =>
  jwt.sign(
    user.toObject({}),
    config.get('secretToken'),
    {},
    callback,
  );
