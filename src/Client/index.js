import got from "got"
import chalk from 'chalk';
import ProgressBar from "progress"
import { Client } from "@theuntraceable/discord-rpc";
import config from "../config.json" assert { type: "json" };
import token from "./token.json" assert { type: "json" };
import fs from "fs";
import NodeRSA from "node-rsa";

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
    const bar = new ProgressBar("[:bar] :percent :etas", {
        complete: chalk.green.bold("="),
        incomplete: chalk.red.bold("-"),
    })
    
    for(const guild of (await client.guilds()).guilds) {
        for(const channel of client.getChannels(guild.id)) {
            await client.subscribe("MESSAGE_CREATE", { channel_id: channel.id });
            bar.tick()
        }
    }
    bar.terminate()
    console.log(chalk.green("Subscribed to MESSAGE_CREATE in all channels!"))
});

client.on("MESSAGE_CREATE", async payload => {
    const { message, channel_id } = payload
    const { id, content, author} = message
    if(author.id != client.user.id) return
    await got.post("http://127.0.0.1:3000/api/sign", {
        json: {
            content,
            id: id,

        }
    })
})

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