import React, { createContext, useContext, useState } from 'react';

interface Order {
  _id: string;
  status: string;
  pizzas: Array<string>;
  orderTime: Date;
}

interface OrderContextType {
  orders: Order[];
  setOrders: (orders: Order[]) => void;
}

// Create Context Object
export const OrdersContext = createContext<OrderContextType>({
  orders: [],
  setOrders: () => {},
});

// Create a provider for components to consume and subscribe to changes
export const OrdersContextProvider: React.FC = (props: React.PropsWithChildren<{}>) => {
  const [orders, setOrders] = useState<Order[]>([]);

  return (
    <OrdersContext.Provider value={{ orders, setOrders }}>
      {props.children}
    </OrdersContext.Provider>
  );
};

// Helper hook to use the OrdersContext and get orders and the setOrders function
export const useOrders = () => useContext(OrdersContext);
