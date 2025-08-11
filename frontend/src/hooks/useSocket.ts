import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

export const useSocket = () => {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const newSocket = io(SOCKET_URL);
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Socket connected');
        });

        newSocket.on('disconnect', () => {
            console.log('Socket disconnected');
        });

        return () => {
            newSocket.disconnect();
        };
    }, []);

    return socket;
};