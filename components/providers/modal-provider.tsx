"use client"


import React, { useState } from 'react'
import { CreateServerModal } from '../modals/create-server-modal'

export function ModalProvider() {

    const[isMounted,setIsMounted] = useState(false);

    React.useEffect(function(){
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }


  return (
    <>
    <CreateServerModal />
    </>
  )
}
