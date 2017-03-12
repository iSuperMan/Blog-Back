import mongoose from 'mongoose';
import config from '../config';

const { uri, options } = config.get('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(uri, options);

export default mongoose;
