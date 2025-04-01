import React, {createContext, useContext, useEffect, useState} from 'react'
import {io} from 'socket.io-client';

const socketContext = createContext();

export const useSocket = () => useContext(socketContext);
    

 
export const socketProvider = ({children}) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io(import.meta.env.VITE_SOCKET_URL);
        setSocket(newSocket);
        return () => newSocket.close();
    }, []);

    return (
        <socketContext.Provider value={socket}>{children}</socketContext.Provider>
    )
}