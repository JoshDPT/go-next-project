import { useState, useEffect } from "react";

export default function useWebSocket(url: string, onMessage: (data: any) => void) {
  const [ws, setWS] = useState<WebSocket | null>(null);

  useEffect(() => {
    const newWS = new WebSocket(url);
    newWS.onerror = (err) => console.error(err);
    newWS.onopen = () => setWS(newWS);
    newWS.onmessage = (msg) => onMessage(JSON.parse(msg.data));
    return () => newWS.close();
  }, [url, onMessage]);

  return ws;
}
