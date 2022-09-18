import NodeRSA from "node-rsa";
import { Client } from "@theuntraceable/discord-rpc";
import config from "../config.json" assert { type: "json" };
import token from "./token.json" assert { type: "json" };
import fs from "fs";

const publicFile = (fs.readFileSync("../.public")).toString();
const privateFile = (fs.readFileSync("../.private")).toString();

const publicKey = new NodeRSA(publicFile);
const privateKey = new NodeRSA(privateFile);

const client = new Client({
    transport: "ipc"
});

client.on("ready", async (message) => {
    console.log(message);
    if (message.access_token) {
        fs.writeFileSync("./token.json", JSON.stringify({
            token: message.access_token,
            expiresAt: message.expires
        }));
    }
});

const loginOptions = {
    clientId: config.client_id,
    clientSecret: config.client_secret,
    scopes: ["identify", "rpc", "messages.read"],
    redirectUri: "https://discord.com"
};

if (token.token && new Date(token.expiresAt) > Date.now()) {
    loginOptions.accessToken = token.token;
}

client.login(loginOptions);