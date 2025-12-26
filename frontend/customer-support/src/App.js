import React, {useState} from "react";
import Chat from "./Chat";
import './Chat.css'
import Logs from "./Logs";

function App() {
  const [showLogs, setShowLogs] = useState(false);

  return (
    <div className="app">
      {showLogs ? (
        <Logs onBack={() => setShowLogs(false)} />
      ) : (
        <Chat onShowLogs={() => setShowLogs(true)} />
      )}
    </div>
  );
}

export default App;
