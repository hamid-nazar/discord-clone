'use client';


import React, { createContext, useContext, useEffect, useState } from 'react'

import { io  as SocketClient} from 'socket.io-client'



type SocketContextTyp = {
    socket: any | null;
    isConnected: boolean;
}


const SocketContext = createContext<SocketContextTyp>({
    socket: null,
    isConnected: false
});



export function useSocket() {

    return useContext(SocketContext);
}

export function SocketProvider({ children }: { children: React.ReactNode }) {

    const [socket, setSocket] = useState<any | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);


    useEffect(function() {

        const socketInstance = new (SocketClient as any)(process.env.NEXT_PUBLIC_SITE_URL!, {
            path: "/api/socket/io",
            addTrailingSlash: false
        }); 

        socketInstance.on("connect", () => {
            setIsConnected(true);
        });

        socketInstance.on("disconnect", () => {
            setIsConnected(false);
        });

        setSocket(socketInstance);


        return () => {

            socketInstance.disconnect();
        } 

    }, []);

  return (
    <div>

        <SocketContext.Provider value={{ socket: socket, isConnected: isConnected }}>

            {children}

        </SocketContext.Provider>
    </div>
  )
}
