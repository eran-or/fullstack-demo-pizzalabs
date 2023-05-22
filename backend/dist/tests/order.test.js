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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app")); // Import your express app
const ws_1 = __importStar(require("ws"));
const http_1 = require("http");
describe('POST /orders', () => {
    it('should create a new order and return 201 status', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
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
    let server;
    let ws;
    beforeAll(() => {
        server = (0, http_1.createServer)(app_1.default);
        ws = new ws_1.Server({ server });
    });
    afterAll(() => {
        server.close();
        ws.close();
    });
    it('should receive pizza updates in order', (done) => {
        const client = new ws_1.default('ws://localhost:8082');
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
