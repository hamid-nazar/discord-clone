import {Server as NextServer} from "http";
import { NextApiRequest } from "next";
import {Server as ServerIO} from "socket.io";

import {NextApiResponseServiceIO} from "@/types";


export const config = {
    api: {
        bodyParser: false
    }
}


export default async function ioHandler(req: NextApiRequest, res: NextApiResponseServiceIO) {

    if (!res.socket.server.io) {

        const httpServer: NextServer = res.socket.server as any;

        const parth = "/api/socket/io";

        const io = new ServerIO(httpServer, {
            path: parth,
            addTrailingSlash: false
        });

    
        res.socket.server.io = io;

        res.end();
    }

}
