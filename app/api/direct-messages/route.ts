import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { DirectMessage } from "@prisma/client";
import { NextResponse } from "next/server";



const MESSAGE_BATCH_SIZE = 10;

export async function GET(req: Request) {

    try {

        const profile = await currentProfile();
        const { searchParams } = new URL(req.url);

        const cursor = searchParams.get("cursor");
        const conversationId = searchParams.get("conversationId");

        if (!profile) {
            return new NextResponse("Not authorized", { status: 401 });
        }

        if (!conversationId) {
            return new NextResponse("conversationId missing", { status: 400 });
        }   


        let messages:DirectMessage[] = [];

        if (cursor) {

            messages = await db.directMessage.findMany({
                take: MESSAGE_BATCH_SIZE,
                skip: 1,
                cursor: {
                    id: cursor
                },
                where: {
                    conversationId: conversationId
                },
                include: {
                    member:{
                        include: {
                            profile: true
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc"
                }
            });


        } else {

            messages = await db.directMessage.findMany({
                take: MESSAGE_BATCH_SIZE,
                where: {
                    conversationId: conversationId 
                },
                include: {
                    member:{
                        include: {
                            profile: true
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc"
                }
            });
        }
            
        let nextCursor = null;

        if (messages.length === MESSAGE_BATCH_SIZE) {

            const nextMessage = messages[MESSAGE_BATCH_SIZE - 1];

            nextCursor = nextMessage.id;
        }

        return NextResponse.json({
            items: messages,
            nextCursor: nextCursor
        });

    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    } 
    
}