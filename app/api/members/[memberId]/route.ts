import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { memberId: string } }) {
    try {
        const profile = await currentProfile();
        const { searchParams } = new URL(req.url);
        const { role } = await req.json();

        const serverId = searchParams.get("serverId");

        if (!profile) {
            return new NextResponse("Not authorized", { status: 401 });
        }

        if (!serverId) {
            return new NextResponse("ServerId missing", { status: 400 });
        }

        if (!params.memberId) {
            return new NextResponse("MemberId missing", { status: 400 });
        }


        const updatedServer = await db.server.update({
            where: {
                id: serverId,
            },
            data: {
                members: {
                    update: {
                        where: {
                            id: params.memberId,
                            profileId: {
                                not: profile.id,
                            },
                        },
                        data: {
                            role: role,
                        },
                    },
                },
            },
            include: {
                members: {
                    include: {
                        profile: true,
                    },
                    orderBy: {
                        role: "asc",
                    },
                },
            },
        });

        return NextResponse.json(updatedServer);

    } catch (error) {
        console.error(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}


export async function DELETE(req: Request, { params }: { params: { memberId: string } }) {
    try {   
        const profile = await currentProfile();
        const { searchParams } = new URL(req.url);
        const serverId = searchParams.get("serverId"); 

        if (!profile) {
            return new NextResponse("Not authorized", { status: 401 });
        }   
        if (!serverId) {
            return new NextResponse("ServerId missing", { status: 400 });
        }

        if (!params.memberId) {
            return new NextResponse("MemberId missing", { status: 400 });
        }

        const updatedServer = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id
            },
            data: {
                members: {
                    delete: {
                        id: params.memberId,
                        profileId:{
                            not: profile.id
                        }
                    },
                },
            },
            include: {
                members: {
                    include: {
                        profile: true,
                    },
                    orderBy: {
                        role: "asc",
                    },
                },
            },
        }); 

        return NextResponse.json(updatedServer);

    } catch (error) {
        console.error(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}