const { createServer } = require('http');
const express = require('express');
const ws = require('ws');
const router = express.Router();
const app = express();
const cors = require('cors');
app.use(cors());

const port = process.env.PORT || 4000;

router.get('/', (request, response) => {
    response.send('Welcome to root');
});

const server = createServer(app);
server.listen(port, () => {
    console.log(`Server running on ${port}`);
})

const wsServer = new ws.Server({ path: "/ws", server});

wsServer.on('connection', socket => {
    console.log("Websocket established");
    socket.on('message', message => console.log(message));
    socket.on('close', () => console.log("Connectioni closed"));
});

app.use('/', router);

// server.on('upgrade', (request, socket, head) => {
//     wsServer.handleUpgrade(request, socket, head, socket => {
//         wsServer.emit('connection', socket, request);
//     });
// });