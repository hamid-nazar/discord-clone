"use client";


import { cn } from '@/lib/utils';
import { Member, MemberRole, Profile, Server } from '@prisma/client';
import {ShieldAlert, ShieldCheck } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React from 'react'
import { UserAvatar } from '../user-avatar';


interface ServerMemberProps {
    member: Member & { profile: Profile };
    server:Server;
}


const roleIconMap = {
    [MemberRole.GUEST]: null,
    [MemberRole.MODERATOR]: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500"/>,
    [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 ml-2 text-rose-500"/>,
}

export function ServerMember({member, server}: ServerMemberProps) {

    const router = useRouter();
    const params = useParams();

    const icon = roleIconMap[MemberRole.GUEST];

    function onClick() {
        router.push(`/servers/${server.id}/conversations/${member.id}`);
    }

  return (
    <button onClick={onClick} className={cn("group px-3 py-2 rounded-md w-full flex items-center gap-x-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
     params.memberId === member.id && "bg-zinc-700/20 dark:bg-zinc-700")}>
        <UserAvatar 
        src={member.profile?.imageUrl}
        className={'h-8 w-8 md:h-8 md:w-8' }
        />
        <p className={cn("font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition",
         params.memberId === member.id && "text-primary dark:text-zinc-200 dark:group-hover:text-white"
        )}>
        {member.profile?.name}
        </p>
    </button>
  )
}
