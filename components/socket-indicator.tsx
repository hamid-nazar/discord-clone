"use client"
import React from 'react'
import { useSocket } from './providers/socket-provider'
import { Badge } from './ui/badge';

export function SocketIndicator() {

    const { isConnected } = useSocket();


    if (!isConnected) {
        return(
            <Badge variant="outline" className='bg-yellow-500 text-white border-none'>
                Fallback: polling every 5 seconds
            </Badge>
        )
    }

  return (

    <Badge variant="outline" className='bg-emerald-500 text-white border-none'>

        Live: real-time updates 

    </Badge>
    
)   
}
