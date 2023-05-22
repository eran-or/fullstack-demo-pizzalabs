import dotenv from 'dotenv';
dotenv.config();
import app from './app';
import {IOrder} from './models/Order'
import WebSocket, { Server } from 'ws';
// The port the express app will listen on
const port = process.env.PORT || 4000;

// Set up WebSocket server
const wss = new WebSocket.Server({ port: 8082 });
const clients: Set<WebSocket> = new Set();

wss.on('connection', (ws: WebSocket) => {
  clients.add(ws);

  ws.on('close', () => {
      clients.delete(ws);
  });

  // ws.on('message', message => {
  //     console.log('Received:', message);
  // });

  //   ws.send('Welcome!');
});

export function broadcastOrderStatus(order:IOrder) {
  // Prepare the message
  const message = JSON.stringify({
      orderId: order._id.toString(),
      status: order.status
  });

  // Broadcast the message to all clients
  clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
          client.send(message);
      }
  });
}

// Serve the application at the given port
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});
