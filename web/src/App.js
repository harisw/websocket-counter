import './App.css';
import W3CWebSocket from 'websocket';
import { useState, useEffect } from 'react';

const SOCKET_URL = process.env.SOCKET_URL || 'ws://localhost:4000/ws';
const SERVER_URL = process.env.SOCKET_URL || 'http://localhost:4000/';
function App() {

  const [client, setClient] = useState(new W3CWebSocket.w3cwebsocket(SOCKET_URL));
  client.onopen = () => {
    console.log('Websocket connected');
    client.send('New client connected');
  }
  client.onmessage = (message) => {
    console.log(message);
  }
  client.onerror = function() {
    console.log('connection error');
  };

  const [counterState, setCounterState] = useState("INACTIVE");

  const handleStart = () => {
    fetch(SERVER_URL+"start")
      .then(res => res.json())
      .then(
        (result) => {
          setCounterState("STARTED");
        },
        (error) => {
          console.log(error);
          setCounterState("ERROR");
        }
      );
  };

  const handlePause = () => {
    fetch(SERVER_URL+"stop")
      .then(
        (result) => {
          setCounterState("PAUSED");
        },
        (error) => {
          console.log(error);
          setCounterState("ERROR");
        }
      )
  };

  const handleCancel = () => {
    fetch(SERVER_URL+"cancel")
      .then(
        (result) => {
          setCounterState("FINISHED");
        },
        (error) => {
          console.log(error);
          setCounterState("ERROR");
        }
      )
  };

  return (
    <div className="text-center bg-gradient-to-bl to-purple-100">
      <h1 className='text-5xl font-bold'>Counter App</h1>
      <h4 className='mt-8 text-2xl font-bold'>Status: {counterState}</h4>
      <div className="flex flex-row justify-center border-black mt-10">
        <button className='p-4 m-8 border-gray-700 bg-blue-300 font-bold' onClick={handleStart}>Start</button>
        <button className='p-4 m-8 border-gray-700 bg-blue-300 font-bold' onClick={handlePause}>Pause</button>
        <button className='p-4 m-8 border-gray-700 bg-blue-300 font-bold' onClick={handleCancel}>Cancel</button>
      </div>
      <h4 className='mt-8 text-2xl font-bold'>Current count: </h4>
    </div>
  );
}

export default App;
