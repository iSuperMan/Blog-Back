/* eslint-disable import/no-extraneous-dependencies */
import 'babel-polyfill';
/* eslint-enable import/no-extraneous-dependencies */

import express from 'express';
import http from 'http';
import errorhandler from 'errorhandler';
import bodyParser from 'body-parser';
import config from './config';
import routes from './routes';

const app = express();
app.set('port', config.get('port'));

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use('/api', routes);

if (process.env.NODE_ENV === 'development') {
	app.use(errorhandler());
}

const server = http.createServer(app);
server.listen(app.get('port'), () => {
	/* eslint-disable no-console */
	console.log(`Start server on port ${app.get('port')}`);
	/* eslint-enable no-console */
});
