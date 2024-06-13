import { useSocket } from "@/components/providers/socket-provider";
import { Member, Message, Profile } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";


type ChatSocketProps = {
    addKey: string,
    updateKey: string,
    queryKey: string,
}

type MessageWithMemberWithProfile = Message & {
    member: Member & {
        profile: Profile
    }
}

export function useChatSocket({ addKey, updateKey, queryKey }: ChatSocketProps) {

    const { socket } = useSocket();
    const queryClient = useQueryClient();

    useEffect(function() {
        if (!socket) {
            return;
        }
 

        socket.on(updateKey, function(message: MessageWithMemberWithProfile) {
            
            queryClient.setQueryData([queryKey], function(oldData: any) {

                if(!oldData || !oldData.pages || oldData.pages.length === 0) {
                    return oldData;
                }

                const newData = oldData.pages.map(function(page: any) {
                    return {
                        ...page,
                        items: page.items.map(function(item: MessageWithMemberWithProfile) {
                            if(item.id === message.id) {
                                return message;
                            }

                            return item;
                        })
                    }
                });

                return {
                    ...oldData,
                    pages: newData
                }

            });

        });


        socket.on(addKey, function(message: MessageWithMemberWithProfile) {

            queryClient.setQueryData([queryKey], function(oldData: any) {

                if(!oldData || !oldData.pages || oldData.pages.length === 0) {
                    return{
                        pages: [{
                            items: [message]
                        }]
                    } 
                }

                let newData = [...oldData.pages];

                newData[0] = {
                    ...oldData[0],
                    items: [
                        message,
                        ...newData[0].items
                    ]
                };

                return {
                    ...oldData,
                    pages: newData
                };

               
                });

            });


        return function() {

            socket.off(addKey);
            socket.off(updateKey);
        }

    }, [socket, queryClient, addKey, updateKey, queryKey]);

  
}
