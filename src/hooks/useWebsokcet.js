import { useEffect, useRef } from 'react';

const useWebSocket = (url, onMessage) => {
    const wsRef = useRef(null);

    useEffect(() => {
        wsRef.current = new WebSocket(url);

        const ws = wsRef.current;

        ws.onopen = () => console.log('WebSocket Connected');
        ws.onmessage = onMessage;
        ws.onerror = (error) => {
            console.error('WebSocket Error:', error);
            ws.close();
        };
        ws.onclose = (event) => {
            console.log('WebSocket Closed. Code:', event.code, 'Reason:', event.reason);
            setTimeout(() => {
                console.log('Attempting to reconnect...');
                wsRef.current = new WebSocket(url);
                wsRef.current.onopen = ws.onopen;
                wsRef.current.onmessage = ws.onmessage;
                wsRef.current.onclose = ws.onclose;
                wsRef.current.onerror = ws.onerror;
            }, 1000);
        };

        return () => ws.close();
    }, [url, onMessage]);

    return wsRef;
};

export default useWebSocket;
