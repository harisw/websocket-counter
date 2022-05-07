const { createServer } = require('http');
const express = require('express');
const { WebSocketServer } = require('ws');
const router = express.Router();
const app = express();
const cors = require('cors');
const { parse } = require('url');
const {PythonShell} = require('python-shell');
const { nanoid } = require('nanoid');
const { spawn} = require('child_process');
app.use(cors());

var clients = {};
const port = process.env.PORT || 4000;
const server = createServer(app);

const frontServer = new WebSocketServer({ noServer: true});

frontServer.on('connection', socket => {
    const newID = nanoid();
    clients[newID] = {
        'front': socket,
        'status': "IDLE"
    };

    socket.send(JSON.stringify({
        'id': newID
    }));
    socket.on('message', message => console.log(message));
    socket.on('close', () => console.log("Connection closed"));
});

const businessServer = new WebSocketServer({ noServer: true});
businessServer.on('connection', socket => {
    console.log("Business socket established");
    socket.on('message', message => {
        console.log(message.toString());
        try {
            const {id, counter} = JSON.parse(message.toString());
            if(counter == 0){
                clients[id]['business'] = socket;
            } else if(counter === "FINISH"){
                clients[id]['status'] = "FINISHED";
            } else {
                clients[id]['front'].send(JSON.stringify({
                    'counter': counter
                }));
            }   
        } catch (err) {
            console.log(err);
        }
    });
    socket.on('close', () => console.log("business closed"));
    socket.on('error', (err) => console.log(err));
})

server.on('upgrade', (request, socket, head) => {
    const { pathname } = parse(request.url);

    if(pathname === '/ws') {
        frontServer.handleUpgrade(request, socket, head, (ws) => {
            frontServer.emit('connection', ws, request);
        });
    } else if (pathname === '/bs') {
        businessServer.handleUpgrade(request, socket, head, (ws) => {
            businessServer.emit('connection', ws, request);
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
    try {
        if(clients[id]['status'] === "IDLE" || clients[id]['status'] === "FINISHED"){
            const pyshell = spawn('python3',["../business/main.py", id]);
    
            pyshell.stderr.on('data', err => {
                console.error(`stderr: ${err.toString()}`);
            });
            clients[id]['status'] = "COUNTING";
            response.send({
                "status": "START"
            });
        } else if(clients[id]['status'] === "PAUSED"){
            clients[id]['business'].send("START");
            response.send({
                "status": "COUNTING"
            });
        }
    } catch (error) {
        response.send({
            "status": "ERROR",
            "message": "Socket not connected"
        });
    }
});
router.get('/stop', (request, response) => {
    const id = request.query.id;
    if(!clients[id]['status'] === "FINISHED"){
        response.send({
            "status": "ERROR",
            "message": "Counter has not started yet"
        });
    } else {
        clients[id]['business'].send("STOP");
        clients[id]['status'] = "PAUSED";
        response.send({
            "status": "PAUSE",
            "message": "Counter has been paused"
        });
    }
});
router.get('/finish', (request, response) => {
    const id = request.query.id;
    try {
        if(clients[id]['status'] !== "FINISHED"){
            clients[id]['business'].send("FINISH");
        }
        response.send({
            "status": "FINISHED",
            "message": "Counter has been finished/canceled"
        });
    } catch (err) {
        response.send({
            "status": "ERROR",
            "message": `Error: ${err}`
        });
        
    }
});

app.use('/', router);

server.listen(port, () => {
    console.log(`Server running on ${port}`);
})