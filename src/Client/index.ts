import { Client } from "@theuntraceable/discord-rpc"
import NodeRSA from "node-rsa"
import configFile from "../config.json" assert {type: "json"}
import tokenFile from "./token.json" assert {type: "json"}
import fs from "fs"

const config: {
    client_id: String
    client_secret: String
} = configFile

// @ts-ignore
const token: { 
    token?: String
    expiresAt?: String
} = tokenFile

const publicFile = (fs.readFileSync("../.public")).toString()
const privateFile = (fs.readFileSync("../.private")).toString()

// @ts-ignore
const client: Client = new Client({
    transport: "ipc"
})

interface ReadyPayload {
    access_token?: String
    expires?: String
    user?: {
        id: String
        username: String
        discriminator: String
        avatar: String
    },
    scopes: String[]
}

client.on("ready", async (message: ReadyPayload) => {
    console.log(message)
    if(message.access_token) {
        fs.writeFileSync("./token.json", JSON.stringify({
            token: message.access_token,
            expiresAt: message.expires
        }))
    }
})

const loginOptions: {clientId: String, clientSecret: String, scopes: String[], redirectUri: String, accessToken?: String} = {
    clientId: config.client_id,
    clientSecret: config.client_secret,
    scopes: ["identify", "rpc", "messages.read"],
    redirectUri: "https://discord.com"
}

// @ts-ignore
if(token.token && new Date(token.expiresAt) > Date()) {
    loginOptions.accessToken = token.token
}

client.login(loginOptions)