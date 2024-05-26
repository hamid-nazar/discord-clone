
import { Server } from '@prisma/client';
import {create} from 'zustand'

export type ModalType = 'createServer'|"invite";

interface ModalData {
    server: Server
}

interface ModalStore {
    type: ModalType | null;
    isOpen: boolean;
    data: ModalData;
    onOpen: (type: ModalType, data?: ModalData) => void;
    onClose: () => void;
}


export const useModal = create<ModalStore>(function (set) {
    return {
        type: null,
        isOpen: false,
        data: {},
        onOpen: (type ,data = {}) => set({type: type, isOpen: true, data: data}), 
        onClose: () => set({type: null, isOpen: false}),
    }
})