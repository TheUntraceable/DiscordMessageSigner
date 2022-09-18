import { Client } from "@theuntraceable/discord-rpc"
import { NodeRSA } from "node-rsa"
import configFile from "../config.json" assert {type: "json"}
import tokenFile from "./token.json" assert {type: "json"}
import fs from "fs/promises"

const config: {
    client_id: String
    client_secret: String
    public_key: String
    private_key: String
} = configFile

const token: {
    token? String
    expiresAt? String
} = tokenFile
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

const loginOptions: {clientId: String, clientSecret: String, scopes: String[], redirectUri: String, accessToken?: String} = {
    clientId: config.client_id,
    clientSecret: config.client_secret,
    scopes: ["identify", "rpc", "messages.read"],
    redirectUri: "https://discord.com"
}

if(token.token && new Date(token.expiresAt) > new Date()) {
    loginOptions.accessToken = token.token
}

client.login(loginOptions)