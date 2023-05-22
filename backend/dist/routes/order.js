"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRouter = void 0;
const express_1 = __importDefault(require("express"));
const Order_1 = require("../models/Order");
const Pizza_1 = require("../models/Pizza");
const pizzaProcessingService_1 = __importDefault(require("../pizzaProcessingService"));
const router = express_1.default.Router();
exports.orderRouter = router;
router.post('/', async (req, res) => {
    const { pizzas: pizzaData } = req.body;
    if (!pizzaData || !Array.isArray(pizzaData)) {
        return res.status(400).json({ error: 'Invalid data format: Expected an array of pizzas' });
    }
    for (let pizza of pizzaData) {
        if (!pizza || !Array.isArray(pizza.toppings)) {
            return res.status(400).json({ error: 'Invalid data format: Each pizza should have an array of toppings' });
        }
        for (let topping of pizza.toppings) {
            if (typeof topping !== 'string') {
                return res.status(400).json({ error: 'Invalid data format: Each topping should be a string' });
            }
        }
    }
    try {
        const pizzas = await Promise.all(pizzaData.map(async (pizza) => {
            const newPizza = new Pizza_1.PizzaModel({
                toppings: pizza.toppings,
                status: Order_1.OrderStatus.DOUGH_CHEF,
            });
            await newPizza.save();
            return newPizza._id;
        }));
        const order = new Order_1.OrderModel({
            status: Order_1.OrderStatus.DOUGH_CHEF,
            pizzas,
        });
        const savedOrder = await order.save();
        await pizzaProcessingService_1.default.processOrder(savedOrder._id.toString());
        return res.status(201).json(order);
    }
    catch (error) {
        console.error('Failed to create order:', error);
        return res.status(500).json({ error: 'Failed to create order' });
    }
});
