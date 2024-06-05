import { db } from "./db";



export async function getOrCreateConversation( memberOneId: string, memberTwoId: string) {

    const conversation = await findConversation(memberOneId, memberTwoId) || await findConversation(memberTwoId, memberOneId);

    if(conversation) {
        return conversation
    }   

    return createConversation(memberOneId, memberTwoId);
}


async function  findConversation( memberOneId: string, memberTwoId: string) {

   try {
        const conversation = await db.conversation.findFirst({
            where: {
                memberOneId: memberOneId,
                memberTwoId: memberTwoId
            },
            include: {
                memberOne:{
                    include: {
                        profile: true
                    }
                },
                memberTwo:{
                    include: {
                        profile: true
                    },
                }
            }
        })

        return conversation

   } catch (error) {
        return null
   }
}


async function createConversation( memberOneId: string, memberTwoId: string) {

   try {
        const conversation = await db.conversation.create({
            data: {
                memberOneId: memberOneId,
                memberTwoId: memberTwoId
            },
            include: {
                memberOne:{
                    include: {
                        profile: true
                    }
                },
                memberTwo:{
                    include: {
                        profile: true
                    },
                }
            }
        })

        return conversation

   } catch (error) {
        return null
   }    


}