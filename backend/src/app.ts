import express from 'express';
import mongoose from 'mongoose';
import { json, urlencoded } from 'body-parser';
import { orderRouter } from './routes/order';
import WebSocket from 'ws';
import connectDB from './database'
import cors from 'cors';

// Create a new express application
const app = express();
// Enable CORS for all routes
app.use(cors({origin: '*'}));
// Use body-parser middleware to parse incoming JSON and url-encoded data
app.use(json());
app.use(urlencoded({ extended: true }));
// Connect to MongoDB
connectDB()
// Define our routes
app.use('/orders', orderRouter);

export default app

