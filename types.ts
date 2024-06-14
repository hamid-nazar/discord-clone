import { Member, Profile, Server } from "@prisma/client";

import {Server as NextServer, Socket} from "net";
import{NextApiRequest, NextApiResponse} from "next"
import{Server as SocketServer} from "socket.io"



export type ServerWithMembersWithProfiles = Server & {
    members:(Member & {
        profile: Profile
    })[]
}

export type NextApiResponseServiceIO = NextApiResponse & {
    socket: Socket & {
        server: NextServer & {
            io: SocketServer
        }
    }
}