"use client"
import React from 'react'

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import { Smile } from 'lucide-react'
  
import Picker from "@emoji-mart/react"
import data from "@emoji-mart/data"
import { useTheme } from 'next-themes'

interface EmojiPickerProps {
    onChange: (emoji: string) => void
}

export function EmojiPicker({onChange}: EmojiPickerProps) {

    const {resolvedTheme} = useTheme();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Smile className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"/>
      </PopoverTrigger>
      <PopoverContent side={'right'} sideOffset={40} className='bg-transparent border-none shadow-none drop-shadow-none mb-16'>

        <Picker theme={resolvedTheme} data={data} onEmojiSelect={(emoji: any) => onChange(emoji.native)} />
       
      </PopoverContent>
    </Popover>
  )
}
