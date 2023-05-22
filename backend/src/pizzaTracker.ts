import express from "express";
import { Server } from "ws";
import http from "http";
import type { IPizza } from "./models/Pizza";
import { PizzaModel } from "./models/Pizza";
import type { IOrder } from "./models/Order";
import { OrderModel, OrderStatus } from "./models/Order";

const app = express();
const server = http.createServer(app);
const wss = new Server({ server });

wss.on("connection", (ws) => {
  ws.on("message", async (message: string) => {
    let data;

    try {
      data = JSON.parse(message);
    } catch (error) {
      ws.send(JSON.stringify({ error: "Invalid JSON" }));
      return;
    }

    const { orderId, pizzaId } = data;

    if (typeof orderId !== "string" || typeof pizzaId !== "string") {
      ws.send(JSON.stringify({ error: "Invalid data format" }));
      return;
    }

    const order: IOrder | null = await OrderModel.findOne({ orderId });
    if (!order) {
      ws.send(JSON.stringify({ error: "Order not found" }));
      return;
    }

    const pizza = order.pizzas.find(
      (pizza: IPizza) => pizza.pizzaId === pizzaId
    );
    if (!pizza) {
      ws.send(JSON.stringify({ error: "Pizza not found in order" }));
      return;
    }

    // Simulate the pizza making process
    const pipeline = [
      OrderStatus.DOUGH_CHEF,
      OrderStatus.TOPPING_CHEF,
      OrderStatus.OVEN,
      OrderStatus.SERVING,
      OrderStatus.DONE,
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
