import mongoose, { Document } from 'mongoose';
import { IPizza } from './Pizza';
export declare enum OrderStatus {
    DOUGH_CHEF = "Preparing Dough",
    TOPPING_CHEF = "Adding Toppings",
    OVEN = "Cooking in Oven",
    SERVING = "Serving",
    DONE = "Done"
}
interface IOrder extends Document {
    orderId: number;
    status: OrderStatus;
    pizzas: IPizza[];
    orderTime: Date;
    totalTime: number;
}
declare const OrderModel: mongoose.Model<IOrder, {}, {}, {}, mongoose.Document<unknown, {}, IOrder> & Omit<IOrder & {
    _id: mongoose.Types.ObjectId;
}, never>, any>;
export type { IOrder };
export { OrderModel };
