import { useState } from "react";

const ConnectionTest = () => {
  const [message, setMessage] = useState("");

  const testConnection = async () => {
    try {
      const res = await fetch("/api/health");
      const data = await res.json();
      setMessage("✅ " + data.message);
    } catch (error) {
      setMessage("❌ Failed to connect");
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Backend Connection Test</h2>
      <button onClick={testConnection}>Test Connection</button>
      <p>{message}</p>
    </div>
  );
};

export default ConnectionTest;