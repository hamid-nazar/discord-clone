import React from 'react'

import {
    Sheet,
    SheetContent,
    SheetTrigger,
  } from "@/components/ui/sheet"
  

import { Menu } from 'lucide-react'
import { Button } from './ui/button'
import { NavigationSidebar } from './navigation/navigation-sidebar'
import { ServerSidebar } from './server/server-sidebar'

interface MobileToggleProps {
    serverId: string
}
export function MobileToggle({serverId}: MobileToggleProps) {


  return (
    <Sheet>

      <SheetTrigger asChild>
        <Button variant={"ghost"} size={"icon"} className="md:hidden">
        <Menu />
        </Button>
      </SheetTrigger>

      <SheetContent side={"left"} className='p-0 flex gap-0'>

        <div className='w-[72px]'>
            <NavigationSidebar />
        </div>
        
        <ServerSidebar serverId={serverId} />

      </SheetContent>

    </Sheet>
  )
}
