import { Client } from "@theuntraceable/discord-rpc"
import { NodeRSA } from "node-rsa"
import config from "../config.json" assert {type: "json"}
import token from "./token.json" assert {type: "json"}
import fs from "fs/promises"

const client: Client = new Client({
    transport: "ipc"
})

interface ReadyPayload {
    accessToken?: String
    expiresAt?: String
    user?: {
        id: String
        username: String
        discriminator: String
        avatar: String
    },
    scopes: String[]
}

client.on("ready", async (message: ReadyPayload) => {
    if(message.accessToken) {
        await fs.writeFile("./token.json", JSON.stringify({
            token: message.accessToken,
            expiresAt: message.expiresAt
        }))
    }


})

