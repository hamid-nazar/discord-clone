"use client"

import { Hash } from 'lucide-react';
import React from 'react'

interface ChatWelcomeProps {
    name: string;
    type: "conversation" | "channel";
}

export function ChatWelcome({name, type}: ChatWelcomeProps) {


  return (
    <div className='space-y-2 px-4 mb-4'>

        {type === "channel" && (

            <div className='h-[75px] w-[75px] bg-zinc-500 dark:bg-zinc-700 rounded-full flex items-center justify-center'>

                <Hash className="h-12 w-12 text-white" />

            </div>
        )}

        <p className='font-bold text-xl md:text-3xl'>
            {type === "channel" ? `Welcome to #` : ``}{name} 
        </p>

        <p className='text-zinc-600 dark:text-zinc-400 text-sm'>
            {type === "channel" ? `This is the start of ${name} channel` : `This is the start of your conversation with ${name}`}
        </p>
   
    </div>
  )
}
