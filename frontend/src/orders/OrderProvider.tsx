import React, { createContext, useContext, useReducer, useEffect } from "react";
import { useWebSocket } from "../websocket/WebSocketProvider";
import {IOrderContext, IOrder} from './types'
import {reducer} from './reducer'
import {baseUrl} from '../services/urlService'
const OrderContext = createContext<IOrderContext>({
    orders: [],
    addOrder: () => null,
    fetchOrders: () => () => null
});

export const useOrders = () => {
    return useContext(OrderContext);
};

interface OrderProviderProps {
    children: React.ReactNode;
}


export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
    const [orders, dispatch] = useReducer(reducer, []);
    const { sendMessage, subscribe } = useWebSocket();

    const addOrder = (order: IOrder) => {
        // sendMessage({ type: "newOrder", payload: order });
        dispatch({ type: "ADD_ORDER", payload: order });
    };
    const fetchOrders = () => {
        const abortController = new AbortController();
        
        new Promise<void>((resolve) => {
          fetch(baseUrl+`/orders`, { signal: abortController.signal })  // replace with your API endpoint
            .then((response) => {
              
              if (!response.ok) { throw new Error("HTTP error " + response.status); }
              return response.json();
            })
            .then((orders) => {
              if (!abortController.signal.aborted) {
                dispatch({ type: 'FETCH_ORDERS', payload: orders });
              }
              resolve();
            })
            .catch((error) => {
              if ((error as Error).name !== 'AbortError') {
                console.error(error);
              }
            });
        });
    
        return function cleanup() {
          abortController.abort();
        }
      };
    
      useEffect(() => {
        const unsubscribe = subscribe((message) => {
          const data = JSON.parse(message.data);  // Parse the JSON string
            const { type, payload } = data;
    
            // Assuming your server sends an 'UPDATE_ORDERS' message
            // with the updated orders as the payload
            if (type === 'UPDATE_ORDERS') {
                dispatch({ type: 'UPDATE_ORDERS', payload });
            }
        });
    
        // Cleanup function to be called when component unmounts
        return unsubscribe;

    }, [subscribe]);

    return (
        <OrderContext.Provider value={{ orders, addOrder, fetchOrders }}>
            {children}
        </OrderContext.Provider>
    );
};
