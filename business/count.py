from twisted.internet import reactor
from autobahn.twisted.websocket import WebSocketClientFactory, WebSocketClientProtocol, connectWS
from time import sleep
import sys

SERVER_URL = 'ws://localhost:4000/bs'
client_id = sys.argv[1]
class EchoClientProtocol(WebSocketClientProtocol):

    def startCount(self):
        total = 0
        i = 1
        while i < 10:
            total += i
            self.sendMessage(str.encode('{"id":"'+client_id+'", counter:'+str(total)+'}'))
            i += 1
            sleep(1)

    def sendHello(self):
        self.sendMessage(str.encode("Hello, world!"))

    def onOpen(self):
        print("opened")
        # self.sendHello()

    def onMessage(self, msg, binary):
        print("Got echo: " + msg)
        reactor.callLater(1, self.startCount)


if __name__ == '__main__':
   factory = WebSocketClientFactory(SERVER_URL)
   factory.protocol = EchoClientProtocol
   connectWS(factory)
   reactor.run()