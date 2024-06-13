"use client"

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import axios from 'axios'
import qs from "query-string"

import { Member, MemberRole, Profile } from '@prisma/client';
import { UserAvatar } from '../user-avatar';
import { ActionTooltip } from '../action-tooltip';
import {Edit, FileIcon, ShieldAlert, ShieldCheck, Trash } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '../ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form';
import { Button } from '../ui/button';
import { useModal } from '@/hooks/use-modal-store';
import { useParams, useRouter } from 'next/navigation';



interface ChatItemProps {
    messageId: string;
    conten: string;
    member: Member & {
        profile: Profile
    },
    timestamp: string;
    fileUrl: string | null;
    deleted: boolean;
    currentMember: Member;
    isUpdated: boolean;
    socketUrl: string;
    socketQuery: Record<string, any>;
}

const roleIconMap = {
    "GUEST": null,
    "MODERATOR": <ShieldCheck className='h-4 w-4 ml-2 text-indigo-500'/>,
    "ADMIN": <ShieldAlert className='h-4 w-4 ml-2 text-rose-500'/>,
}

const formSchema = z.object({
    content: z.string().min(1),
})

export function ChatItem({
    messageId,
    conten,
    member,
    timestamp,
    fileUrl,
    deleted,
    currentMember,
    isUpdated,
    socketUrl,
    socketQuery
}: ChatItemProps) {

    const [isEditing, setIsEditing] = useState(false);
  
    const {onOpen} = useModal();
    const router = useRouter();
    const params = useParams();

    function onMemberClick() {
        if(member.id === currentMember.id) {
            return;
        }

        router.push(`/servers/${params?.serverId}/conversations/${member.id}`);
    }

    useEffect(function() {

        function handleKeydown(event: any) {

            if (event.key === "Escape" || event.keyCode === 27) {

              event.preventDefault();

              setIsEditing(false);

            }
          }
        
          window.addEventListener("keydown", handleKeydown);
        
          return () => {
            window.removeEventListener("keydown", handleKeydown);
          };

    }, []);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: conten
        }
    });


    const isLoading = form.formState.isSubmitting;

    async function onSubmit(values: z.infer<typeof formSchema>) {

       try {

        const url = qs.stringifyUrl({
            url: `${socketUrl}/${messageId}`,
            query: socketQuery
        })
        
        await axios.patch(url,values);

        form.reset();
        setIsEditing(false);

       } catch (error) {
        console.log(error);
       }

    }


    useEffect(function() {

        form.reset({content: conten});

    }, [conten, form]);


    const fileType = fileUrl?.split('.').pop();

    const isAdmin = currentMember.role === MemberRole.ADMIN;
    const isModerator =  currentMember.role === MemberRole.MODERATOR;
    const isOwner = currentMember.id === member.id;

    const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
    const canEditMessage = !deleted && isOwner && !fileUrl;

    const isPdf = fileType === "pdf" && fileUrl;
    const isImage = !isPdf && fileUrl;
    

    
  return (
    <div className='relative group flex items-center hover:bg-black/5 p-4 transition w-full'>
        <div className=' group flex gap-x-2 items-start w-full'>

            <div 
            className='cursor-pointer hover:drop-shadow-md transition'
            onClick={onMemberClick}>
                <UserAvatar
                src={member.profile?.imageUrl}
                />
            </div>
            
            <div className='flex flex-col w-full'>
                <div className='flex items-center gap-x-2'>
                    <div className='flex items-center'>
                        <p className='font-semibold text-sm hover:underline cursor-pointer'
                        onClick={onMemberClick}>
                            {member.profile?.name}
                        </p>
                        <ActionTooltip label={member.role} side={'top'}>
                            {roleIconMap[member.role]}
                        </ActionTooltip>
                    </div>
                    <p className='text-zinc-500 dark:text-zinc-400 text-xs'>
                        {timestamp}
                    </p>
                </div>

                {isImage && (
                    <a 
                    href={fileUrl || ""}
                    target="_blank" 
                    rel='noopener noreferrer'
                    className='relative aspect-square rounded-md mt-2 overflow-hidden flex items-center bg-secondary w-48 h-48'>
                        <Image 
                        src={fileUrl || ""} 
                        alt={conten} 
                        fill
                        className='object-cover'/>
                    </a>
                )}

                {isPdf && (
                    <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
                    <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
                    <a 
                    href={fileUrl || ""} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className='ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline'>

                      PDF File

                    </a>
                  </div>
                )}

                {!fileUrl && !isEditing && (
                    <p className={cn("text-sm text-zinc-600 dark:text-zinc-300", 
                    deleted && "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1")}>

                        {conten}

                        {isUpdated && !deleted && (
        
                            <span className='text-[10px] mx-2 text-zinc-500 dark:text-zinc-400'>
                                (edited)
                            </span>
                        )}
                    </p>
                )}
                {!fileUrl && isEditing && (
                    <Form {...form}>
                        <form 
                        className='flex items-center w-full gap-x-2 pt-2'
                        onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                            control={form.control}
                            name="content"
                            render={({field}) => (
                              <FormItem className='flex-1'>
                                <FormControl>
                                    <div className='relative w-full'>
                                        <Input
                                        className='p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 
                                        focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200'
                                        disabled={isLoading}
                                        placeholder="Edited message"
                                        {...field}
                                    />
                                    </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                            />

                            <Button
                            size={"sm"}
                            variant={"primary"}
                            disabled={isLoading}>
                                Save
                            </Button>
                            
                        </form>
                        <span className='text-[10px] mt-1 text-zinc-400'>
                            Press escape to cancel, enter to save
                        </span>
                    </Form>
                )}
            </div>

        </div>

        {canDeleteMessage && (
            <div className='hidden group-hover:flex items-center gap-x-2 p-1 absolute -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm'>
                {canEditMessage && (
                    <ActionTooltip label='Edit'>
                        <Edit
                        onClick={() => setIsEditing(true)}
                        className='cursor-pointer ml-auto h-4 w-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition'/>
                    </ActionTooltip>
                )}
                <ActionTooltip label='Delete'>
                    <Trash className='cursor-pointer ml-auto h-4 w-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition'
                    onClick={() => onOpen("deleteMessage",{
                        apiUrl: `${socketUrl}/${messageId}`,
                        query: socketQuery
                    })}/>
                </ActionTooltip>
            </div>
        )}

    </div>
  )
}
