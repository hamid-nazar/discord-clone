"use client";


import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
  } from "@/components/ui/command"
  
  import { Search } from 'lucide-react';
import { useParams, useRouter } from "next/navigation";
  import React, { useEffect, useState } from 'react'


interface ServerSearchProps {
    data:{
        label: string;
        type:"member" | "channel";
        data:{
            id: string;
            name: string;
            icon: React.ReactNode;
        }[] | undefined
    }[]
}


export default function ServerSearch({data}: ServerSearchProps) {

    const [open, setOpen] = useState(false);
    const router = useRouter();
    const params = useParams();


    useEffect(function(){
        
        function onKeyDown(event: KeyboardEvent) {

            if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
              event.preventDefault();
              setOpen(!open);
            }
          }
        
          document.addEventListener("keydown", onKeyDown);
        
          return () => {
            document.removeEventListener("keydown", onKeyDown);
          };

    }, []);


    function onClick({id, type}: {id: string, type: "member" | "channel"}) {

        setOpen(false);

        if(type === "member") {

           return router.push(`/servers/${params.serverId}/conversations/${id}`);
            
        }

        if (type === "channel") {

            return router.push(`/servers/${params.serverId}/channels/${id}`);
        }
    }

  return (
    <>
    <button onClick={() => setOpen(true)} className="group px-2 py-2 rounded-md flex items-center gap-x-2 w-full
        hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">

            <Search className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
        <p className='font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600
        dark:group-hover:text-zinc-300 transition'>
            Search
        </p>
        <kbd className='pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded px-1.5
                        border bg-muted font-mono text-[10px] font-medium text-muted-foreground ml-auto'>

            <span className="text-xs">⌘</span> K
           
        </kbd>
    </button>


    <CommandDialog open={open} onOpenChange={setOpen}>

            <CommandInput placeholder="Search all channels and members" />

            <CommandList>

                <CommandEmpty>No results found </CommandEmpty>

                {data.map(({label, type, data}) => {

                   if(!data?.length){
                    return null;
                   }

                   return (<CommandGroup key={label} heading={label}>

                        {data?.map(({id, name, icon}) => {

                           return <CommandItem key={id} onSelect={() => onClick({id, type})}>

                                         {icon}
                                    <span>{name}</span>

                                 </CommandItem>
                        })} 

                    </CommandGroup>
                    )
                })}

            </CommandList>
            
    </CommandDialog>
    
    </>
  )
}
