
import React from 'react'

import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import {ChatHeader} from '@/components/chat/chat-header';
import { ChatInput } from '@/components/chat/chat-input';
import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { ChatMessages } from '@/components/chat/chat-massages';

interface ChannelIdPageProps {
    params: {
        serverId: string
        channelId: string
    }
}

export default async function ChannelIdPage({params}: ChannelIdPageProps) {


    const profile = await currentProfile();

    if (!profile) {
        return auth().redirectToSignIn();
    }

    const {serverId, channelId} = params;

    const channel = await db.channel.findUnique({
        where: {
            id: channelId
        }
    })

    const member = await db.member.findFirst({
        where: {
            profileId: profile.id,
            serverId: serverId
        }
    })

    if(!channel || !member) {
        return redirect("/");
    }


console.log(channel.name)


    return (

    <div className='flex flex-col bg-white dark:bg-[#313338] h-screen'>
        <ChatHeader serverId={channel.serverId} name={channel.name} type={'channel'} />

        <ChatMessages 
            name={channel.name} 
            member={member} 
            chatId={channel.id}
            apiUrl={'/api/messages'} 
            socketUrl={'/api/socket/messages'} 
            socketQuery={{channelId: channelId, serverId: serverId}} 
            paramKey={'channelId'} 
            paramValue={channel.id} 
            type={'channel'} />

        <ChatInput apiUrl={'/api/socket/messages'} query={{serverId, channelId}} name={channel.name} type={'channel'} />
    </div>


    )
}
