import { config } from './config/config';
import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import Logging from './library/Logging';
import authorRoutes from './routes/Author';
import bookRoutes from './routes/Book';

const router = express();

//Connect Mongoose
mongoose
    .connect(config.mongo.url, { retryWrites: true, w: 'majority' })
    .then(() => {
        Logging.info('Database Connected');
        StartServer();
    })
    .catch((error) => {
        Logging.error('Unable Connect to the Database: ');
        Logging.error(error);
    });

//Only start the server if MongoDB Connected
const StartServer = () => {
    router.use((req, res, next) => {
        /**Log the request */
        Logging.info(`OutGoing -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

        res.on('finish', () => {
            /**Log the Response */
            Logging.info(`Incoming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}] - status: [${res.statusCode}]`);
        });

        next();
    });

    router.use(express.urlencoded({ extended: true }));
    router.use(express.json());

    /**Rules of Our API */

    router.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

        if (req.method == 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
            return res.status(200).json({});
        }

        next();
    });

    /** Routes */
    router.use('/authors', authorRoutes);
    router.use('/books', bookRoutes);

    /**Health Checks */
    router.get('/ping', (req, res, next) => res.status(200).json({ message: 'pong' }));

    /**Error Handler */
    router.use((req, res, next) => {
        const error = new Error('Not Found!');
        Logging.error(error);

        return res.status(404).json({ message: error.message });
    });

    http.createServer(router).listen(config.server.port, () => Logging.info(`Server is Running on Port ${config.server.port}`));
};
