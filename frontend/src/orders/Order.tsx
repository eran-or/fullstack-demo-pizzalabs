import React from "react";
import {IOrder} from './types'
import {getFormatedDateTime} from '../services/date'

interface OrderProps {
  order: IOrder;
}

const Order: React.FC<OrderProps> = ({ order }) => {
  return (
    <div className="border border-solid border-gray-300 p-3 mb-2 bg-sky-50">
      <div><strong>Order ID:</strong> {order.orderId} | <span>Status: {order.status}</span></div>
      <div><strong>Order Time:</strong> {getFormatedDateTime(order.orderTime)}</div>
      {order.pizzas.map((pizza, index) => (
        <div key={index}>
          <div><strong>Pizza ID:</strong> {pizza.pizzaId}</div>
          <div><strong>Toppings: </strong>{pizza.toppings.join(', ')}</div>
        </div>
      ))}
    </div>
  );
}

export default Order
