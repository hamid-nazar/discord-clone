
import {ChatHeader} from '@/components/chat/chat-header';
import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react'

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





    return(

        <div className='bg-white dark:bg-[#313338] flex flex-col h-full'>
            
            <ChatHeader serverId={serverId} name={channel.name} type={'channel'}/>

        </div>
    )
}
