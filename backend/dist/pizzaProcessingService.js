"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Order_1 = require("./models/Order");
const server_1 = require("./server");
class PizzaProcessingService {
    constructor() {
        // Define the processing times in milliseconds
        this.doughPrepTime = 7000;
        this.toppingPrepTime = 4000; // per topping
        this.cookingTime = 10000;
        this.servingTime = 5000;
    }
    // Function to process orders
    async processOrder(orderId) {
        try {
            const order = await Order_1.OrderModel.findById(orderId);
            if (!order) {
                console.log('Order not found');
                return;
            }
            // Prepare the dough
            await this.prepareDough(order);
            // Prepare the toppings
            await this.prepareToppings(order);
            // Cook the pizza
            await this.cookPizza(order);
            // Serve the pizza
            await this.servePizza(order);
            order.status = Order_1.OrderStatus.DONE;
            await order.save();
            // Broadcast the order status to frontend
            // This should be implemented in the WebSocket setup
            (0, server_1.broadcastOrderStatus)(order);
        }
        catch (error) {
            console.error('Failed to process order:', error);
        }
    }
    // Prepare the dough
    async prepareDough(order) {
        order.status = Order_1.OrderStatus.DOUGH_CHEF;
        await order.save();
        (0, server_1.broadcastOrderStatus)(order);
        await this.sleep(this.doughPrepTime);
    }
    // Prepare the toppings
    async prepareToppings(order) {
        for (const pizza of order.pizzas) {
            // Simulate the time it takes for each topping
            for (const topping of pizza.toppings) {
                order.status = Order_1.OrderStatus.TOPPING_CHEF;
                await order.save();
                (0, server_1.broadcastOrderStatus)(order);
                await this.sleep(this.toppingPrepTime);
            }
        }
    }
    // Cook the pizza
    async cookPizza(order) {
        order.status = Order_1.OrderStatus.OVEN;
        await order.save();
        (0, server_1.broadcastOrderStatus)(order);
        await this.sleep(this.cookingTime);
    }
    // Serve the pizza
    async servePizza(order) {
        order.status = Order_1.OrderStatus.SERVING;
        await order.save();
        (0, server_1.broadcastOrderStatus)(order);
        await this.sleep(this.servingTime);
    }
    // Helper function to pause execution for a given time
    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
exports.default = new PizzaProcessingService();
