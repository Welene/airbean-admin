import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import menuRoutes from './routes/menu.js';
import ordersRoutes from './routes/orders.js';
import errorHandler from './middleware/errorHandler.js';
import authRouter from './routes/auth.js';
import logger from './middleware/logger.js';
import cart from './routes/cart.js';
import swaggerUI from 'swagger-ui-express';
import YAML from 'yamljs';

//config
dotenv.config();
const app = express();
const PORT = process.env.PORT;
mongoose.connect(process.env.CONNECTION_STRING);
const database = mongoose.connection;
const swaggerDocs = YAML.load('./docs/docs.yml'); // inneholder min documentasjon

//Middlewares
app.use(express.json());
app.use(logger);

// ROUTES
app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));
app.use('/api', menuRoutes);
app.use('/api', ordersRoutes);
app.use('/api/auth', authRouter);
app.use('/api/cart', cart);

//DB Emit events
database.on('error', (error) => console.log(error));
database.once('connected', () => {
	console.log('Database is now connected');
	//Startar servern
	app.listen(PORT, () => {
		console.log(`Server is running on ${PORT}`);
	});
});

//error handling
app.use(errorHandler);
