"use client"

import React from 'react'

import qs from "query-string"
import { useRouter, useParams, useSearchParams, usePathname } from 'next/navigation'
import { ActionTooltip } from '../action-tooltip'
import { Icon, Video, VideoOff } from 'lucide-react'

export function ChatVideoButton() {

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const isVideo = searchParams?.get("video");

    const Icon = isVideo ? VideoOff: Video;

    const tooltipLabel = isVideo ? "End video call" : "Start video call";


    function onClick() {
       
        const url = qs.stringifyUrl({
            url: pathname || "",
            query: {
                video: isVideo ? undefined : true
            }
        }, {
            skipNull: true
        });

        router.push(url);
    }


  return (
    <ActionTooltip label={tooltipLabel} side={'bottom'}>

      <button 
      className='hover:opacity-75 transition mr-4'
      onClick={onClick}>
        <Icon className='h-6 w-6 text-zinc-500 dark:text-zinc-400' />
      </button>

    </ActionTooltip>
  )
}
