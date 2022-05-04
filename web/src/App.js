import './App.css';
import W3CWebSocket from 'websocket';

const SERVER_URL = process.env.SERVER_URL || 'ws://127.0.0.1:4000/ws';
function App() {

  const client = new W3CWebSocket.w3cwebsocket(SERVER_URL);
  
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

  return (
    <div className="text-center bg-gradient-to-bl to-purple-100">
      <h1 className='text-5xl font-bold'>Counter App</h1>
      <h4 className='mt-8 text-2xl font-bold'>Current count: </h4>
      <div className="flex flex-row justify-center border-black mt-10">
        <button className='p-4 m-8 border-gray-700 bg-blue-300 font-bold'>Start</button>
        <button className='p-4 m-8 border-gray-700 bg-blue-300 font-bold'>Pause</button>
        <button className='p-4 m-8 border-gray-700 bg-blue-300 font-bold'>Cancel</button>
      </div>
    </div>
  );
}

export default App;
