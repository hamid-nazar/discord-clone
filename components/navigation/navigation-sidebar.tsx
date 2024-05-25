import React from 'react'
import { redirect } from 'next/navigation'
import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { NavigationAction } from './navigation-action';

export async function NavigationSidebar() {

    const profile = await currentProfile();

    if(!profile) {
        return redirect;
    }

    const servers = await db.server.findMany({
        where: {
          members: {
            some: {
              profileId: profile.id
            }
          }
        }
      });

    
  return (
    <div className='space-y-4 flex flex-col items-center h-full text-primary
    w-full dark:bg-[#1E1f22] py-2'>
        <NavigationAction/>
    </div>
  )
}


