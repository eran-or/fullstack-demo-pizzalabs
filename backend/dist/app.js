"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = require("body-parser");
const order_1 = require("./routes/order");
const database_1 = __importDefault(require("./database"));
const cors_1 = __importDefault(require("cors"));
// Create a new express application
const app = (0, express_1.default)();
// Enable CORS for all routes
app.use((0, cors_1.default)({ origin: '*' }));
// Use body-parser middleware to parse incoming JSON and url-encoded data
app.use((0, body_parser_1.json)());
app.use((0, body_parser_1.urlencoded)({ extended: true }));
// Connect to MongoDB
(0, database_1.default)();
// Define our routes
app.use('/orders', order_1.orderRouter);
exports.default = app;
