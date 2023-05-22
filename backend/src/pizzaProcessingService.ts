import { IOrder, OrderModel, OrderStatus } from "./models/Order";
import { broadcastOrderStatus } from "./server";

class PizzaProcessingService {
  // Define the processing times in milliseconds
  private doughPrepTime: number = 7000;
  private toppingPrepTime: number = 4000; // per topping
  private cookingTime: number = 10000;
  private servingTime: number = 5000;

  private totalDoughChefs: number = 2;
  private totalToppingChefs: number = 3;
  private totalOvens: number = 1;
  private totalWaitres: number = 2;

  // Function to process orders
  public async processOrder(orderId: string) {
    try {
      const order: IOrder | null = await OrderModel.findById(orderId).populate(
        "pizzas"
      );
      if (!order) {
        console.error("Order not found");
        return;
      }

      // Prepare the dough
      await this.prepareDough(order);
    } catch (error) {
      console.error("Failed to process order:", error);
    }
  }

  // Prepare the dough
  private async prepareDough(order: IOrder) {
    order.status = OrderStatus.DOUGH_CHEF;
    await order.save();
    broadcastOrderStatus(order);
    //The time it takes to prepare the total dough by 2 chefs
    
    const timeout =
      Math.ceil(order.pizzas.length / this.totalDoughChefs) * this.doughPrepTime;
      await delay(timeout);
      await this.prepareToppings(order);
  }

  // Prepare the toppings
  private async prepareToppings(order: IOrder) {
    for (const pizza of order.pizzas) {
      if (pizza.toppings.length) {
        order.status = OrderStatus.TOPPING_CHEF;      
        await order.save();
        broadcastOrderStatus(order);
        // Simulate the time it takes to put the toppings
          let timeout = (this.toppingPrepTime/2)/this.totalToppingChefs;
          await delay(timeout);
          await this.cookPizza(order);
      }
    }
  }

  // Cook the pizza
  private async cookPizza(order: IOrder) {
    order.status = OrderStatus.OVEN;
    await order.save();
    broadcastOrderStatus(order);
    // Simulate the time it takes to cook all the pizzas.
    let timeout = order.pizzas.length*this.cookingTime
    await delay(timeout);
    await this.servePizza(order);
  }

  // Serve the pizza
  private async servePizza(order: IOrder) {
    order.status = OrderStatus.SERVING;
    await order.save();
    broadcastOrderStatus(order);
    let timeout = (order.pizzas.length*5)/2
    await delay(timeout);
    await this.done(order);
  }

  private async done(order: IOrder) {
    order.status = OrderStatus.DONE;
    await order.save(); 
    broadcastOrderStatus(order);
  }

}

function delay(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
export default new PizzaProcessingService();
