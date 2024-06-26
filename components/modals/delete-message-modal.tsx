"use client"

import React, { useState } from 'react'

import qs from "query-string"

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';

import { useModal } from '@/hooks/use-modal-store';
import { Button } from '../ui/button';
import axios from 'axios';
import { useRouter } from 'next/navigation';





export function DeleteMessageModal(){

    const {isOpen,type, onClose, data} = useModal();
    
    const isModalOpen = isOpen && type === 'deleteMessage';
    const {apiUrl, query} = data;


    const[isLoading, setIsLoading] = useState(false);


   async function leaveServer() {
       try {
           setIsLoading(true);

           const url  = qs.stringifyUrl({
             url: apiUrl || "",
             query
           });


           await axios.delete(url);

           onClose();

       } catch(err){

           console.log(err);
           
       } finally{
           setIsLoading(false);
       }
    }



  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>

    <DialogContent className="bg-white text-black p-0 overflow-hidden">

      <DialogHeader className='pt-8 px-6'>

        <DialogTitle className='text-2xl text-center font-bold'>
          Delete Message
        </DialogTitle>

        <DialogDescription className='text-center text-zinc-500'>
          Are you sure you want to do this? <br/>
          The message will be permenently deleted.
        </DialogDescription>

      </DialogHeader>

      <DialogFooter className='bg-gray-100 px-6 py-4'>
        <div className='flex items-center justify-between w-full'>

            <Button disabled={isLoading}  variant={'ghost'} onClick={onClose}>
              Cancel
            </Button>

            <Button disabled={isLoading} variant={'primary' } onClick={leaveServer}>
              Confirm
            </Button>

        </div>

      </DialogFooter>
 
    </DialogContent>
    </Dialog>
  )
}
