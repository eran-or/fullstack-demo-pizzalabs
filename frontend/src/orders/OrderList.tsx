import React, { useEffect } from 'react';
import { useOrders } from './OrderProvider';
import Order from './Order';
import { Link } from 'react-router-dom';

const OrderList: React.FC = () => {
  const { orders, fetchOrders } = useOrders();
  useEffect(() => {
    const cleanup = fetchOrders();
    return () => {
      cleanup();
    }
  }, [fetchOrders]);

  return (
    <div className='m-5'>
      {!orders.length&&<h3>There's no orders yet, <br /> click on <Link to={'/new-order'}>New Order</Link> to create one</h3>}  
      {orders.map((order) => (
        <Order key={order.orderId} order={order} />
      ))}
    </div>
  );
};

export default OrderList;
