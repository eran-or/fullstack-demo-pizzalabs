import express, { Request, Response } from 'express';
import type {IOrder} from '../models/Order'
import { OrderModel, OrderStatus } from '../models/Order';
import type {IPizza} from '../models/Pizza';
import { PizzaModel } from '../models/Pizza';
import PizzaProcessingService from '../pizzaProcessingService';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
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
    const pizzas = await Promise.all(
      pizzaData.map(async (pizza: any) => {
        const newPizza = new PizzaModel({
          toppings: pizza.toppings,
          status: OrderStatus.DOUGH_CHEF,
        });
        await newPizza.save();
        return newPizza._id;
      })
    );
    
    const order = new OrderModel({
      status: OrderStatus.NEW,
      pizzas,
    });

    const savedOrder = await order.save();
    PizzaProcessingService.processOrder(savedOrder._id.toString()).catch((error)=>{
      console.error('Failed to process order:', error);
    })
    let populatedOrder = await OrderModel.findById(savedOrder._id).populate('pizzas', '-__v');
    let orderPizzas = (populatedOrder?.pizzas as IPizza[]).map((pizza) => {
      return {
          pizzaId: pizza._id,
          toppings: pizza.toppings
      };
  });
    return res.status(201).json({
      orderId: savedOrder._id.toString(),
      status: savedOrder.status,
      pizzas: orderPizzas,
      orderTime: savedOrder.orderTime
    });
  } catch (error) {
    console.error('Failed to create order:', error);
    return res.status(500).json({ error: 'Failed to create order' });
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const orders = await OrderModel.find().populate('pizzas', '-__v');
    const formattedOrders = orders.map((order) => {
      let orderPizzas = (order.pizzas as IPizza[]).map((pizza) => {
        return {
            pizzaId: pizza._id,
            toppings: pizza.toppings,
            status: pizza.status
        };
      });
      return {
        orderId: order._id.toString(),
        status: order.status,
        pizzas: orderPizzas,
        orderTime: order.orderTime
      };
    });
    res.json(formattedOrders);
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});


export { router as orderRouter };
