import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>D20 Dice Roller</h1>
      <p>Application is running!</p>
      <button onClick={() => window.electronAPI?.closeApp()}>
        Close App
      </button>
    </div>
  );
}

export default App;