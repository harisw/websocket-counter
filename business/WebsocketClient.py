import websockets
import asyncio
from websockets import client

LIMIT = 5
DELAY = 1 #computation delay in seconds
class WebSocketClient():
    def __init__(self, id):
        self.paused = False
        self.finished = False
        self.id = id

    async def connect(self, server_url):
        self.connection = await client.connect(server_url)
        if self.connection.open:
            print("Connection established")
            await self.sendMessage("This is websocket client")
            await self.connection.send('{"id": "'+self.id+'", "counter": 0}')

            return self.connection
        
    async def sendMessage(self, msg):
        await self.connection.send(msg)

    async def receiveMessage(self, conn):
        while True:
            try:
                if self.finished:
                    break
                msg = await conn.recv()
                if msg == "STOP":
                    self.paused = True
                elif msg == "START":
                    self.paused = False
                elif msg == "FINISH":
                    self.finished = True
                    break
                print('Received message '+ str(msg), flush=True)

            except websockets.exceptions.ConnectionClosed:
                print('Connection with server closed')
                break
    
    async def counter(self, conn):
        total = 0
        i = 1
        while i <= LIMIT:
            try:
                if self.finished:
                    break
                if not self.paused:
                    total += i
                    i += 1
                    await conn.send('{"id": "'+self.id+'", "counter": '+str(total)+'}')
                    await asyncio.sleep(DELAY)
            except websockets.exceptions.ConnectionClosed:
                print('Connection closed')
                break
        self.finished = True