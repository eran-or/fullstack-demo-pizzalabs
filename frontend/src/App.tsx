import React from 'react';
import { WebSocketProvider } from "./websocket/WebSocketProvider";
import Header from "./features/header/Header";
import { OrderProvider } from "./orders/OrderProvider";
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <WebSocketProvider socketUrl="ws://localhost:8082">
    <Header />
    <OrderProvider>
      <Outlet />
    </OrderProvider>
</WebSocketProvider>
  );
}

export default App;
