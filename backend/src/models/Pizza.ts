import mongoose, { Document, Schema } from 'mongoose';

interface IPizza extends Document {
  pizzaId: string;
  toppings: string[];
  status: string;
}

// pizzaId: { type: Number, required: true, unique: true },
const PizzaSchema: Schema = new Schema({
  toppings: { type: [String], required: false },
  status: { type: String, required: true, default: 'Dough Chef' },
});

const PizzaModel = mongoose.model<IPizza>('Pizza', PizzaSchema);

export type { IPizza }
export { PizzaModel };
