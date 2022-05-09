import asyncio
from WebsocketClient import WebSocketClient
import sys

if __name__ == '__main__':
    SERVER_URL = 'ws://localhost:4000/bs'
    client = WebSocketClient(id=sys.argv[1])
    loop = asyncio.get_event_loop()
    connection = loop.run_until_complete(client.connect(SERVER_URL))
    tasks = [
        asyncio.ensure_future(client.counter(connection)),
        asyncio.ensure_future(client.receiveMessage(connection))
    ]
    loop.run_until_complete(asyncio.wait(tasks))
