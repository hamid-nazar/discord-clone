"use client";
import React from 'react'




import { Channel, ChannelType, MemberRole, Server } from '@prisma/client';
import { Edit, Hash, Lock, Mic, Trash, Video, X } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ActionTooltip } from '../action-tooltip';
import { ModalType, useModal } from '@/hooks/use-modal-store';

interface ServerChannelProps {
    channel:Channel;
    server:Server;
    role?: MemberRole;
}


const iconMap = {
    [ChannelType.TEXT]: Hash,
    [ChannelType.AUDIO]: Mic,
    [ChannelType.VIDEO]: Video,
}


export function ServerChannel({channel, server, role}: ServerChannelProps) {

    const { onOpen } = useModal();

    const router = useRouter();
    const params = useParams();

    const Icon = iconMap[channel.type];


    function onClick() {
        router.push(`/servers/${server.id}/channels/${channel.id}`);
    }

    function onActionClick(e: React.MouseEvent,action:ModalType) {
        e.stopPropagation();

        onOpen(action,{server,channel});
    }

  return (
   <button onClick={onClick} className={cn("group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
    params.channelId === channel.id && "bg-zinc-700/20 dark:bg-zinc-700"
   )}>

        {<Icon className="flex-shrink-0 h-5 w-5 text-zinc-500 dark:text-zinc-400" />}

        <p className={cn("line-clamp-1 font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 + dark:group-hover:text-zinc-300 transition",
             params.channelId === channel.id && "text-primary dark:text-zinc-200 dark:group-hover:text-white"
        )}>
            {channel.name}
        </p>

        {role !== MemberRole.GUEST && channel.name !== "general" && (
            <div className='flex items-center gap-x-2 ml-auto'>

                <ActionTooltip label={'Edit'}>
                    <Edit onClick={(e) => onActionClick(e,"editChannel")} className=" hidden group-hover:block h-4 w-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition" />
                </ActionTooltip>

                <ActionTooltip label={'Delete'}>
                    <Trash onClick={(e) => onActionClick(e,"deleteChannel")} className=" hidden group-hover:block h-4 w-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition" />
                </ActionTooltip>

            </div>
        )}

        {channel.name === "general" && (
            <Lock className="ml-auto h-4 w-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition" />
        )}
   </button>
  )
}
