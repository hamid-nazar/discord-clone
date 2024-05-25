'use client';

import React from 'react'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface ActionTooltipProps {
   label: string;
   children: React.ReactNode;
   side?: 'top' | 'bottom' | 'left' | 'right';
   align?: 'start' | 'center' | 'end';
}

export function  ActionTooltip({label, children, side = 'top', align = 'center'}: ActionTooltipProps) {
  return (
    <TooltipProvider>

        <Tooltip delayDuration={50}>

            <TooltipTrigger asChild>

                {children}

            </TooltipTrigger>

            <TooltipContent side={side} align={align}>

                <p className="font-bold text-sm capitalize">
                    {label.toLowerCase()}
                </p>

            </TooltipContent>

        </Tooltip>

        
    </TooltipProvider>
  )
}
