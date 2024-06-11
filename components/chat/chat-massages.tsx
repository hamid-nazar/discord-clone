"use client"

import { Member, Message, Profile } from '@prisma/client';
import React, { Fragment } from 'react'
import { ChatWelcome } from './chat-welcome';
import { useChatQuery } from '@/hooks/use-chat-query';
import { Loader2, ServerCrash } from 'lucide-react';


interface ChatMessagesProps {
   name: string;
   member: Member;
   chatId: string;
   apiUrl: string;
   socketUrl: string;
   socketQuery: Record<string, any>;
   paramKey: "channelId" | "conversationId";
   paramValue: string;
   type: "conversation" | "channel";
}

type MessageWithMemberWithProfile = Message & {
  member: Member & {
    profile: Profile
  }
  
}

export function ChatMessages({
  name,
  member,
  chatId,
  apiUrl,
  socketUrl,
  socketQuery,
  paramKey,
  paramValue,
  type
}: ChatMessagesProps) {

  const queryKey = `chat:${chatId}`;

  const {       
    data, 
    fetchNextPage,
    hasNextPage, 
    isFetchingNextPage,
    status} = useChatQuery({queryKey, apiUrl, paramKey, paramValue});


  if(status === "pending") {
    return (
      <div className='flex-1 flex flex-col items-center justify-center '>

          <Loader2 className='h-7 w-7 text-zinc-500 animate-spin my-4'/>
          <p className='text-zinc-500 dark:text-zinc-400 text-xs'>
              Loading...
          </p>

      </div>
    )
  }

  if(status === "error") {
    return (
      <div className='flex-1 flex flex-col items-center justify-center '>

          <ServerCrash className='h-7 w-7 text-zinc-500 my-4'/>
          <p className='text-zinc-500 dark:text-zinc-400 text-xs'>
              Something went wrong
          </p>

      </div>
    )
  }

  return (
    <div className='flex-1 flex flex-col py-4 overflow-y-auto'>
        <div className='flex-1'/>
        <ChatWelcome name={name} type={type}/>
        <div className='flex flex-col-reverse mt-auto'>

          { data?.pages?.map((group, i) => (

            <Fragment key={i}>

              {group.items.map((message: MessageWithMemberWithProfile) => (

                <div key={message.id}>
                  {message.content}
                </div>

              ))}

            </Fragment>

          ))
        }
          
        </div>
    </div>
  )
}
