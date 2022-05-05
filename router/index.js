const { createServer } = require('http');
const express = require('express');
const { WebSocketServer } = require('ws');
const router = express.Router();
const app = express();
const cors = require('cors');
const parse = require('url').parse;
const {PythonShell} = require('python-shell');
const { nanoid } = require('nanoid');

app.use(cors());


var clients = {};
const port = process.env.PORT || 4000;
const server = createServer(app);

const frontServer = new WebSocketServer({ noServer: true});

let pyInstance = {};
let currentID = 0;

frontServer.on('connection', socket => {
    console.log("Websocket established");
    const newID = nanoid();
    clients[newID] = socket;

    socket.send(JSON.stringify({
        'id': newID
    }));
    socket.on('message', message => console.log(message));
    socket.on('close', () => console.log("Connectioni closed"));

});

server.on('upgrade', (request, socket, head) => {
    const { pathname } = parse(request.url);

    if(pathname === '/ws') {
        frontServer.handleUpgrade(request, socket, head, (ws) => {
            frontServer.emit('connection', ws, request);
        });
    } else {
        socket.destroy();
    }
});

router.get('/', (request, response) => {

    response.send({'msg': 'Welcome to root'});
});
router.get('/start', (request, response) => {
    
    const id = request.query.id;
    const pyshell = new PythonShell('../count.py', {
        args: [id]
    });

    pyshell.on('message', function(data) {
        try {
            const parsed = JSON.parse(data);
            clients[parsed.id].send(JSON.stringify({
                'counter': parsed.counter
            }));
        } catch (err) {
            console.log(err);
        }
    });    
    response.send({
        "msg": "received start"
    });
});
router.get('/stop', (request, response) => {
    response.send("received stop");
});
router.get('/finish', (request, response) => {
    response.send("received finish");
});

app.use('/', router);

server.listen(port, () => {
    console.log(`Server running on ${port}`);
})