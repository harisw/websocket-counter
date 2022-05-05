import websocket
import _thread
import time
import rel
import sys
from sys import exit

SERVER_URL = 'ws://localhost:4000/bs'
client_id = sys.argv[1]

def on_message(ws, message):
    print(message)

def on_error(ws, err):
    print(err)
def on_close(ws, status_code, message):
    print("Closed, status ", status_code)

def on_open(ws):
    print("Opened connection")

if __name__ == "__main__":
    # websocket.enableTrace(True)
    # ws = websocket.WebSocketApp(SERVER_URL,
    #                             on_open=on_open,
    #                             on_message=on_message,
    #                             on_error=on_error,
    #                             on_close=on_close)
    
    # ws.run_forever(dispatcher=rel)
    # rel.signal(2, rel.abort)
    # rel.dispatch()
    
    # ws.send("START")
    total = 0
    for i in range(1,5):
        total += i
        #print(total)
        print('{"id": "'+client_id+'", "counter": '+str(total)+'}', flush=True)
        # ws.send("COUNT|"+str(total))
        # print("COUNT|"+str(total))
        time.sleep(2)
    print('{"id": "'+client_id+'", "counter": "FINISH"}', flush=True)
    exit()