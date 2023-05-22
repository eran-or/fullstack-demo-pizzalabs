"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ws_1 = require("ws");
const http_1 = __importDefault(require("http"));
const Order_1 = require("./models/Order");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const wss = new ws_1.Server({ server });
wss.on("connection", (ws) => {
    ws.on("message", async (message) => {
        let data;
        try {
            data = JSON.parse(message);
        }
        catch (error) {
            ws.send(JSON.stringify({ error: "Invalid JSON" }));
            return;
        }
        const { orderId, pizzaId } = data;
        if (typeof orderId !== "string" || typeof pizzaId !== "string") {
            ws.send(JSON.stringify({ error: "Invalid data format" }));
            return;
        }
        const order = await Order_1.OrderModel.findOne({ orderId });
        if (!order) {
            ws.send(JSON.stringify({ error: "Order not found" }));
            return;
        }
        const pizza = order.pizzas.find((pizza) => pizza.pizzaId === pizzaId);
        if (!pizza) {
            ws.send(JSON.stringify({ error: "Pizza not found in order" }));
            return;
        }
        // Simulate the pizza making process
        const pipeline = [
            Order_1.OrderStatus.DOUGH_CHEF,
            Order_1.OrderStatus.TOPPING_CHEF,
            Order_1.OrderStatus.OVEN,
            Order_1.OrderStatus.SERVING,
            Order_1.OrderStatus.DONE,
        ];
        let i = 0;
        const interval = setInterval(async () => {
            if (ws.readyState !== ws.OPEN) {
                // Client disconnected
                clearInterval(interval);
                return;
            }
            pizza.status = pipeline[i];
            i++;
            if (i >= pipeline.length) {
                clearInterval(interval);
                // Update the total time to complete the order
                order.totalTime = Date.now() - order.orderTime.getTime();
                await order.save();
            }
            await pizza.save();
            // Send updated pizza status to the client
            ws.send(JSON.stringify({ orderId, pizzaId, status: pizza.status }));
        }, 5000); // Adjust the interval as necessary
    });
});
server.listen(8080, () => {
    console.log("PizzaTracker is listening on port 8080");
});
// Handle server shutdown gracefully
process.on("SIGTERM", () => {
    console.info("SIGTERM signal received. Closing HTTP server.");
    server.close(() => {
        console.log("HTTP server closed.");
    });
});
