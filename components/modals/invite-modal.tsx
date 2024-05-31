"use client"

import React, { useState } from 'react'


import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';

import { useModal } from '@/hooks/use-modal-store';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Check, Copy, RefreshCcw } from 'lucide-react';
import { useOrigin } from '@/hooks/use-origin';
import axios from 'axios';





export function InviteModal(){

    const {isOpen,type, onOpen, onClose, data} = useModal();
    const origin = useOrigin();

    const isModalOpen = isOpen && type === 'invite';
    const {server} = data;

    const[copied, setCopied] = useState(false);
    const[isLoading, setIsLoading] = useState(false);

    const inviteUrl = `${origin}/invite/${server?.inviteCode}`;


    function copyToClipboard() {

        navigator.clipboard.writeText(inviteUrl);

        setCopied(true);

        setTimeout(function() {
            setCopied(false);
        }, 3000);

    };


   async function generateNewLink() {

    try{
        setIsLoading(true);

        const response = await axios.patch(`/api/servers/${server?.id}/invite-code`);
        
        onOpen("invite", {server: response.data});

        setIsLoading(false);

    } catch(err){

        console.log(err);
        setIsLoading(false);
    }
   }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>

    <DialogContent className="bg-white text-black p-0 overflow-hidden">

      <DialogHeader className='pt-8 px-6'>

        <DialogTitle className='text-2xl text-center font-bold'>
           Invite Friends
        </DialogTitle>

      </DialogHeader>

        <div className='p-6'>

            <Label className='uppercase text-sx font-bold text-zinc-500 dark:text-secondary/70'>
                Server invite link
            </Label>

            <div className='flex items-center mt-2 gap-x-2'>

                <Input
                className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0'
                value={inviteUrl}
                disabled={isLoading}
                />

                <Button disabled={isLoading} onClick={copyToClipboard} size={"icon"} variant='ghost'>

                   {copied ? <Check className='h-4 w-4'/> : <Copy className='h-4 w-4'/>}
                </Button>
            </div>

            <Button onClick={generateNewLink} disabled={isLoading} variant={"link"} size={"sm"} className='text-sx text-zinc-500 mt-4'>

                Generate a new link
                <RefreshCcw className='h-4 w-4 ml-2'/>
            </Button>

        </div>

    </DialogContent>



    </Dialog>
  )
}
