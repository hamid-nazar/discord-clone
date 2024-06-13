import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { NextApiResponseServiceIO } from "@/types";
import { NextApiRequest } from "next";



export default async function handler(req: NextApiRequest, res: NextApiResponseServiceIO) {


    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }


    try {
        
        const profile = await currentProfilePages(req);

        const {content, fileUrl} = req.body;
        const {conversationId} = req.query;

        if(!profile) {
            return res.status(401).json({ error: "Not authorized" });
        }

        if(!conversationId) {
            return res.status(400).json({ error: "ConversationId missing" });
        }

        if(!content) {
            return res.status(400).json({ error: "Content missing" });
        }

   

        const conversation = await db.conversation.findFirst({
            where: {
                id: conversationId as string,
                OR: [
                    {
                        memberOne:{
                            profileId: profile.id
                        }
                    },
                    {
                        memberTwo:{
                            profileId: profile.id
                        }
                    } 
                ]
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
        });


        if(!conversation) {
            return res.status(400).json({ error: "Conversation not found" });
        }


        const memeber = conversation.memberOne.profileId === profile.id ? conversation.memberTwo : conversation.memberOne


        if(!memeber) {
            return res.status(401).json({ error: "Not authorized" });
        }

        const message = await db.directMessage.create({
            data: {
                content: content,
                fileUrl: fileUrl,
                conversationId: conversationId as string,
                memberId: memeber.id
            },
            include: {
                member:{
                    include: {
                        profile: true
                    }
                }
            }
        });


        const channelKey = `chat:${conversationId}:messages`;

        res?.socket?.server?.io?.emit(channelKey, message);

        res.status(200).json({ message: message });

    } catch (error) {

        res.status(500).json({ error: "Internal Server Error" });
    }

  
}
