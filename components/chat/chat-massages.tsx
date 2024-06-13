"use client"

import { Member, Message, Profile } from '@prisma/client';
import React, { Fragment } from 'react'
import {format} from 'date-fns'
import { ChatWelcome } from './chat-welcome';
import { useChatQuery } from '@/hooks/use-chat-query';
import { Loader2, ServerCrash } from 'lucide-react';
import { ChatItem } from './chat-item';
import { useChatSocket } from '@/hooks/use-chat-socket';



interface ChatMessagesProps {
   name: string;
   member: Member;
   channelId: string;
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

const DATE_FORMAT = "d MM yyyy, HH:mm";

export function ChatMessages({
  name,
  member,
  channelId,
  apiUrl,
  socketUrl,
  socketQuery,
  paramKey,
  paramValue,
  type
}: ChatMessagesProps) {

  const queryKey = `chat:${channelId}`;
  const addKey = `chat:${channelId}:messages`;
  const updateKey = `chat:${channelId}:messages:update`;

  const {       
    data, 
    fetchNextPage,
    hasNextPage, 
    isFetchingNextPage,
    status} = useChatQuery({queryKey, apiUrl, paramKey, paramValue});

    useChatSocket({addKey, updateKey, queryKey});


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

                <ChatItem
                  key={message.id}
                  messageId={message.id}
                  conten={message.content}
                  fileUrl={message?.fileUrl}
                  deleted={message.deleted}
                  timestamp={format(message.createdAt, DATE_FORMAT)} 
                  member={message.member}
                  currentMember={member}
                  isUpdated={message.updatedAt !== message.createdAt}
                  socketUrl={socketUrl}
                  socketQuery={socketQuery}/>

              ))}

            </Fragment>

          ))
        }
          
        </div>
    </div>
  )
}
