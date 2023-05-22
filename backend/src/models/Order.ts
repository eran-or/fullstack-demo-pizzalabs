import mongoose, { Document, Schema } from 'mongoose';
import { IPizza } from './Pizza';

export enum OrderStatus {
  NEW = "New",
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
// orderId: { type: Number, required: true, unique: true },
const OrderSchema: Schema = new Schema({
  status: { type: String, required: true, default: OrderStatus.DOUGH_CHEF },
  pizzas: { type: [Schema.Types.ObjectId], ref: 'Pizza' },
  orderTime: { type: Date, default: Date.now },
  totalTime: { type: Number },
});

const OrderModel = mongoose.model<IOrder>('Order', OrderSchema);

export type { IOrder }
export { OrderModel };
