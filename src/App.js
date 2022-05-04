import logo from './logo.svg';
import './App.css';
import W3CWebSocket from 'websocket/lib/W3CWebSocket';

const client = new W3CWebSocket('ws://localhost:3001/ws');

function App() {
  return (
    <h1 className='text-3xl font-bold'>
      Hello!
    </h1>
  );
}

export default App;
