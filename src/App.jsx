import {useEffect, useState} from 'react'
import './App.css'
import Game from "./lib/Game.js";

function App() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    new Game(window, document.body);
  }, []);
}

export default App
