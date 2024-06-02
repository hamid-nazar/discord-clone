"use client"

import React, { useState } from 'react'

import qs from "query-string"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';

import { useModal } from '@/hooks/use-modal-store';
import { Check, Gavel, Loader2, MoreVertical, Shield, ShieldAlert, ShieldCheck, ShieldQuestion, Trash } from 'lucide-react';
import { ServerWithMembersWithProfiles } from '@/types';
import { ScrollArea } from '../ui/scroll-area';
import { UserAvatar } from '../user-avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { DropdownMenuSeparator } from '@radix-ui/react-dropdown-menu';
import axios from 'axios';
import { MemberRole } from '@prisma/client';
import { useRouter } from 'next/navigation';




const roleIconMap = {
    "GUEST": null,
    "MODERATOR": <ShieldCheck className='h-4 w-4 ml-2 text-indigo-500'/>,
    "ADMIN": <ShieldAlert className='h-4 w-4 text-rose-500'/>,
}



export function MembersModal(){

  const router = useRouter();

    const {isOpen,type, onOpen, onClose, data} = useModal();

    const[loadingId, setLoadingId] = useState<string>(''); 


    const isModalOpen = isOpen && type === 'members';
    const {server} = data as {server: ServerWithMembersWithProfiles};

  
    async function changeMemberRole(memberId: string, role: MemberRole) {
        try {

            setLoadingId(memberId);

            const url  = qs.stringifyUrl({
              url: `/api/members/${memberId}/`, 
              query: {
                serverId: server.id
              }
            });

            // const response = await axios.patch(`/api/members/${memberId}?serverId=${server.id}`, {role: role});

            const response = await axios.patch(url, {role: role});

            router.refresh();

            onOpen("members", {server: response.data});

        } catch (error) {

            console.error(error);

        } finally {

            setLoadingId('');
        }
    }

    async function kickOutMember(memberId: string) {
        try {

          setLoadingId(memberId);

          const url  = qs.stringifyUrl({
            url: `/api/members/${memberId}/`, 
            query: {
              serverId: server.id
            }
          });

           const response = await axios.delete(url);

           router.refresh();

           onOpen("members", {server: response.data});

        } catch (error) {

            console.error(error);

        } finally {
            setLoadingId('');
        }
    }
    

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>

    <DialogContent className="bg-white text-black overflow-hidden">

      <DialogHeader className='pt-8 px-6'>

        <DialogTitle className='text-2xl text-center font-bold'>
          Manage Members
        </DialogTitle>


      <DialogDescription className='text-center text-zinc-500'>

        {server?.members?.length} Members

    </DialogDescription>


      </DialogHeader>


  <ScrollArea className="mt-8 max-h-[420px] pr-6">

    {server?.members?.map((member) => (

      <div key={member.id} className='flex items-center gap-x-2 mb-6'> 
      
      <UserAvatar src={member.profile.imageUrl}/>
      <div className='flex flex-col gap-y-1'>
        <div className='text-xs font-semibold flex items-center gap-x-1'>

            {member.profile.name}

            {roleIconMap[member.role]}

        </div>
        <p className='text-xs text-zinc-500'>

          {member.profile.email}
        </p>
      </div>
      {server.profileId !== member.profileId && loadingId !== member.id && (
        <div className='ml-auto'>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <MoreVertical className='h-4 w-4 text-zinc-500'/>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="left">
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className='flex items-center'>

                   <ShieldQuestion className='h-4 w-4 mr-2'/>

                   <span>Role</span>
                  
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>

                    <DropdownMenuItem onClick={() => changeMemberRole(member.id, "GUEST")}>
                      <Shield className='h-4 w-4 mr-2'/>
                      Guest
                      {member.role ==="GUEST" && <Check className='h-4 w-4 ml-auto'/>}
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => changeMemberRole(member.id, "MODERATOR")}>
                      <ShieldCheck className='h-4 w-4 mr-2'/>
                      Moderator
                      {member.role === "MODERATOR" && <Check className='h-4 w-4 ml-auto'/>}
                    </DropdownMenuItem>

                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuSeparator/>

              <DropdownMenuItem onClick={() => kickOutMember(member.id)}>

                <Gavel className='h-4 w-4 mr-2'/>
                Kick
              </DropdownMenuItem>

            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {loadingId === member.id && (
        <div className='ml-auto'>
          <Loader2 className='h-4 w-4 animate-spin text-zinc-500 ml-auto'/>
        </div>
      )}
     </div>

    ))}
  </ScrollArea>

    </DialogContent>

    </Dialog>
  )
}
