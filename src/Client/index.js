import { Client } from "@theuntraceable/discord-rpc";
import configFile from "../config.json" assert { type: "json" };
import tokenFile from "./token.json" assert { type: "json" };
import fs from "fs";
const config = configFile;
// @ts-ignore
const token = tokenFile;
const publicFile = (fs.readFileSync("../.public")).toString();
const privateFile = (fs.readFileSync("../.private")).toString();
// @ts-ignore
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
// @ts-ignore
if (token.token && new Date(token.expiresAt) > Date()) {
    loginOptions.accessToken = token.token;
}
client.login(loginOptions);
