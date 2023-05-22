
export enum OrderStatus {
  DOUGH_CHEF = "Preparing Dough",
  TOPPING_CHEF = "Adding Toppings",
  OVEN = "Cooking in Oven",
  SERVING = "Serving",
  DONE = "Done"
}

export interface IPizza extends Document {
  pizzaId: string;
  toppings: string[];
  status: string;
}

export interface IOrder extends Document {
  orderId: number;
  status: OrderStatus;
  pizzas: IPizza[];
  orderTime: Date;
  totalTime: number;
}

export interface IOrderContext {
    orders: IOrder[];
    addOrder: (order: IOrder) => void;
    fetchOrders: () => () => void;
}

export interface IAction {
  type: string;
  payload: any;
}