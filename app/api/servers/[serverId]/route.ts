import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";



export async function PATCH(req: Request, { params }: { params: { serverId: string } }) { 


    try {
        const profile = await currentProfile();
        const {name, imageUrl} = await req.json();

        if(!profile) {
            return new NextResponse("Not authorized", {status: 401});
        } 
        

        const server = await db.server.update({
            where: {
                id: params.serverId,
                profileId: profile.id
            },
            data: {
                name: name,
                imageUrl: imageUrl
            }
        });     

        return NextResponse.json(server);
        
    } catch (error) {
       return new NextResponse("Internal Server Error", {status: 500});
    }
}


export async function DELETE(req: Request, { params }: { params: { serverId: string } }) {

    try {
        const profile = await currentProfile();
        const serverId = params.serverId;

        
        if (!profile) {
            return new NextResponse("Not authorized", { status: 401 });
        }

        if (!serverId) {
            return new NextResponse("ServerId missing", { status: 400 });
        }   

        const updatedServer = await db.server.delete({
            where: {
                id: serverId,
                profileId: profile.id
            }
        })


        return NextResponse.json(updatedServer);
        
    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

