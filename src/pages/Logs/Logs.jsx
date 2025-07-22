import React, { useEffect, useState } from "react";
import "./Logs.css";
import { useToken } from "../../contexts/TokenProvider";

export const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const { getTokenLogsService } = useToken();

  useEffect(() => {
    (async () => {
      try {
        const response = await getTokenLogsService();
        if (response.status === 200) {
          setLogs(response.data.logs.reverse());
        }
      } catch (err) {
        console.error("Failed to fetch logs:", err);
      } finally {
        setLoadingLogs(false);
      }
    })();
  }, [getTokenLogsService]);

  return (
    <div className="page-container">
      <div className="logs-container">
        <h2>Block Explorer</h2>
        {loadingLogs ? (
          <p>Loading logs...</p>
        ) : logs.length === 0 ? (
          <p>No transactions found.</p>
        ) : (
          logs.map((log) => (
            <div key={log.id} className={`log-card ${log.type}`}>
              <p><strong>Type:</strong> {log.type.toUpperCase()}</p>
              <p><strong>From:</strong> {log.from || "SYSTEM"}</p>
              <p><strong>To:</strong> {log.to}</p>
              <p><strong>Amount:</strong> {log.amount} tokens</p>
              <p><strong>Time:</strong> {new Date(log.timestamp).toLocaleString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
