import React from 'react';
import './Popup.css';

async function run() {
  chrome.runtime.sendMessage({ action: 'RUN_PROGRAM' })
}

const Popup = () => {
  return (
    <div className="App">
      <button onClick={run}>Run</button>
    </div>
  );
};

export default Popup;
