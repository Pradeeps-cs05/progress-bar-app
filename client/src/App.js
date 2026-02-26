import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("IDLE");
  const [history, setHistory] = useState([]);
  const intervalRef = useRef(null);

  useEffect(() => {
    fetchTask();
  }, []);

  useEffect(() => {
    if (status === "RUNNING") {
      intervalRef.current = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(intervalRef.current);
            updateTask(100, "COMPLETED");
            return 100;
          }
          updateTask(prev + 2, "RUNNING");
          return prev + 2;
        });
      }, 100);
    }

    return () => clearInterval(intervalRef.current);
  }, [status]);

  const fetchTask = async () => {
    const res = await axios.get("/api/task");
    setProgress(res.data.value);
    setStatus(res.data.status);
    setHistory(res.data.history || []);
  };

  const updateTask = async (value, newStatus) => {
    const res = await axios.put("/api/task", {
      value,
      status: newStatus,
    });

    setStatus(res.data.status);
    setHistory(res.data.history || []);
  };

  const handleStart = () => updateTask(progress, "RUNNING");

  const handlePause = () => {
    clearInterval(intervalRef.current);
    updateTask(progress, "PAUSED");
  };

  const handleResume = () => updateTask(progress, "RUNNING");

  const handleReset = () => {
    clearInterval(intervalRef.current);
    setProgress(0);
    updateTask(0, "IDLE");
  };

  return (
    <div className="container">
      <h1>Progress Bar</h1>

      <div className="status">{status}</div>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${progress}%` }}
        >
          {progress}%
        </div>
      </div>

      <div className="buttons">
        <button onClick={handleStart}>Start</button>
        <button onClick={handlePause}>Pause</button>
        <button onClick={handleResume}>Resume</button>
        <button onClick={handleReset}>Reset</button>
      </div>

      <h2>Task History</h2>

      <div className="history">
        {history.length === 0 && <p>No completed tasks yet.</p>}

        {history.map((item, index) => (
          <div key={index} className="history-item">
            <span>{item.status}</span>
            <span>{item.value}%</span>
            <span>
              {new Date(item.completedAt).toLocaleTimeString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;