"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModel = exports.OrderStatus = void 0;
const mongoose_1 = __importStar(require("mongoose"));
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["DOUGH_CHEF"] = "Preparing Dough";
    OrderStatus["TOPPING_CHEF"] = "Adding Toppings";
    OrderStatus["OVEN"] = "Cooking in Oven";
    OrderStatus["SERVING"] = "Serving";
    OrderStatus["DONE"] = "Done";
})(OrderStatus = exports.OrderStatus || (exports.OrderStatus = {}));
// orderId: { type: Number, required: true, unique: true },
const OrderSchema = new mongoose_1.Schema({
    status: { type: String, required: true, default: OrderStatus.DOUGH_CHEF },
    pizzas: { type: [mongoose_1.Schema.Types.ObjectId], ref: 'Pizza' },
    orderTime: { type: Date, default: Date.now },
    totalTime: { type: Number },
});
const OrderModel = mongoose_1.default.model('Order', OrderSchema);
exports.OrderModel = OrderModel;
