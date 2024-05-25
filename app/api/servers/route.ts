import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { ChannelType, MemberRole } from "@prisma/client";


import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";


export async function POST(request: Request) {

   try {
    const { name, imageUrl } = await request.json();

    const profile = await currentProfile();

    if(!profile) {
        return new Response(JSON.stringify({
            error: "Not authorized"
        }), {
            status: 401
        })
    }

    const server = await db.server.create({
        data: {
            profileId: profile.id,
            name: name,
            imageUrl: imageUrl,
            inviteCode: uuidv4(),
            channels: {
                create: {
                    name: "general",
                    profileId: profile.id,
                    type: ChannelType.TEXT
                }
            },
            members: {
                create: {
                    profileId: profile.id,
                    role: MemberRole.ADMIN  
                }
            }
        }
    });

    
    return NextResponse.json(server);
    
    } catch (error) {
        console.log(["SERVER-POST"], error);

        return new NextResponse("internal server error", { status: 500 })
    }

    
}