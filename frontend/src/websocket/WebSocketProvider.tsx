import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef } from "react";

type IWebSocketContext = {
  socket: WebSocket | null;
  subscribe: (callback: (message: MessageEvent<any>) => void) => () => void;
  sendMessage: (message: string) => void;
};

const WebSocketContext = createContext<IWebSocketContext>({
  socket: null,
  subscribe: () => () => {},
  sendMessage: () => {},
});


export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
      throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  const { socket, subscribe, sendMessage } = context;
  return { socket, subscribe, sendMessage };
};

interface WebSocketProviderProps {
    children: React.ReactNode;
    socketUrl: string;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children, socketUrl }) => {
    const webSocket = useRef<WebSocket | null>(null);

    useEffect(() => {
        webSocket.current = new WebSocket(socketUrl);
        webSocket.current.onopen = () => console.log("WebSocket connected");
        webSocket.current.onclose = () => console.log("WebSocket disconnected");

        return () => {
            webSocket.current?.close();
        };
    }, [socketUrl]);

    const sendMessage = useCallback((message: string) => {
      const ws = webSocket.current
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(message);
      }
    },[]);

    const subscribe = useCallback((callback: (message: MessageEvent) => void) => {
      if(webSocket.current){
        webSocket.current.onmessage = callback
      }
      
      // return an unsubscribe function
      return () => {
        if (webSocket.current) {
          webSocket.current.onmessage = null;
        }
      }
    },[])

    const value = { socket:webSocket.current, subscribe, sendMessage }

    return (
        <WebSocketContext.Provider value={value}>
            {children}
        </WebSocketContext.Provider>
    );
};
