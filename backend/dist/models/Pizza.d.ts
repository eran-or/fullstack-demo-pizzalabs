import mongoose, { Document } from 'mongoose';
interface IPizza extends Document {
    pizzaId: string;
    toppings: string[];
    status: string;
}
declare const PizzaModel: mongoose.Model<IPizza, {}, {}, {}, mongoose.Document<unknown, {}, IPizza> & Omit<IPizza & {
    _id: mongoose.Types.ObjectId;
}, never>, any>;
export type { IPizza };
export { PizzaModel };
