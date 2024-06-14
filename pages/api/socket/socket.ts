import {Server as HttpServer} from "http";
import { NextApiRequest } from "next";
import {Server as SocketServer} from "socket.io";

import {NextApiResponseServiceIO} from "@/types";


export const config = {
    api: {
        bodyParser: false
    }
}


export default async function socketHandler(req: NextApiRequest, res: NextApiResponseServiceIO) {

    if (!res.socket.server.io) {

        const httpServer: HttpServer = res.socket.server as any;

        const parth = "/api/socket/io";

        const io = new SocketServer(httpServer, {
            path: parth,
            addTrailingSlash: false
        });

    
        res.socket.server.io = io;

        res.end();
    }

}
