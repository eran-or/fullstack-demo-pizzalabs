import request from 'supertest';
import app from '../app';  // Import your express app
import WebSocket, { Server } from 'ws';
import { createServer } from 'http';

describe('POST /orders', () => {
  it('should create a new order and return 201 status', async () => {
    const res = await request(app)
      .post('/orders')
      .send({
        pizzas: [
          { toppings: ['Mushrooms', 'Pepperoni'], status: 'Dough Chef' }
        ]
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('pizzas');
  });
});

describe('WebSocket connection', () => {
  let server:ReturnType<typeof createServer>;
  let ws: WebSocket.Server;

  beforeAll(() => {
    server = createServer(app);
    ws = new Server({ server });
  });

  afterAll(() => {
    server.close();
    ws.close();
  });

  it('should receive pizza updates in order', (done) => {
    const client = new WebSocket('ws://localhost:8082');

    client.on('open', () => {
      client.send(JSON.stringify({ orderId: '1', pizzaId: '1' }));
    });

    const expectedUpdates = ['Dough Chef', 'Topping Chef', 'Oven', 'Serving', 'Done'];
    let i = 0;

    client.on('message', (data) => {
      const message = JSON.parse(data.toString());
      
      expect(message.status).toBe(expectedUpdates[i]);

      i++;

      if (i >= expectedUpdates.length) {
        client.close();
        done();
      }
    });
  });
});
