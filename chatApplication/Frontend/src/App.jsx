import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:5000', {
  autoConnect: false
});

function App() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');

  const signup = async () => {
    await axios.post('http://localhost:5000/api/signup', { username, password });
    alert('Signup successful');
  };

  const login = async () => {
    const res = await axios.post('http://localhost:5000/api/login', { username, password });
    setToken(res.data.token);
    socket.auth = { token: res.data.token };
    socket.connect();
  };

  useEffect(() => {
    socket.on('previousMessages', (msgs) => setMessages(msgs));
    socket.on('chatMessage', (msg) => setMessages((prev) => [...prev, msg]));
    return () => socket.off();
  }, []);

  const sendMessage = () => {
    if (text.trim()) socket.emit('chatMessage', text);
    setText('');
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      {!token ? (
        <div className="mb-4">
          <input className="border p-2 mr-2" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input className="border p-2 mr-2" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="bg-blue-500 text-white px-4 py-2 mr-2" onClick={signup}>Signup</button>
          <button className="bg-green-500 text-white px-4 py-2" onClick={login}>Login</button>
        </div>
      ) : (
        <>
          <div className="h-80 overflow-y-auto border p-4 mb-4">
            {messages.map((m, i) => (
              <div key={i}><strong>{m.user}:</strong> {m.text}</div>
            ))}
          </div>
          <div>
            <input className="border p-2 mr-2 w-2/3" placeholder="Type a message" value={text} onChange={(e) => setText(e.target.value)} />
            <button className="bg-blue-500 text-white px-4 py-2" onClick={sendMessage}>Send</button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
