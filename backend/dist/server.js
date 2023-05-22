"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.broadcastOrderStatus = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_1 = __importDefault(require("./app"));
const ws_1 = __importDefault(require("ws"));
// The port the express app will listen on
const port = process.env.PORT || 4000;
// Set up WebSocket server
const wss = new ws_1.default.Server({ port: 8082 });
const clients = new Set();
wss.on('connection', (ws) => {
    clients.add(ws);
    ws.on('close', () => {
        clients.delete(ws);
    });
    // ws.on('message', message => {
    //     console.log('Received:', message);
    // });
    //   ws.send('Welcome!');
});
function broadcastOrderStatus(order) {
    // Prepare the message
    const message = JSON.stringify({
        orderId: order._id.toString(),
        status: order.status
    });
    // Broadcast the message to all clients
    clients.forEach((client) => {
        if (client.readyState === ws_1.default.OPEN) {
            client.send(message);
        }
    });
}
exports.broadcastOrderStatus = broadcastOrderStatus;
// Serve the application at the given port
app_1.default.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});
