import { Client, IntentsBitField } from "discord.js";
import express from "express";
import config from "../config.json" assert { type: "json" };
import crypto from "crypto"
import NodeRSA from "node-rsa";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { MongoClient } from "mongodb";

const app = express()
const client = new Client({
    intents: [IntentsBitField.Flags.DirectMessages]
})

app.mongo = new MongoClient("mongodb+srv://TheUntraceable:4IoHuCknMjY9Fx02@cluster0.6mr9kau.mongodb.net/?retryWrites=true&w=majority")
app.mongo.connect()

app.db = app.mongo.db("discord")
app.db.users = app.db.collection("users")
app.db.messages = app.db.collection("messages")


app.use(express.json())

const securityMapping = {}

app.post("/api/login", async (req, res) => {
    const { id } = req.body
    if(Number.isInteger(id)) {
        if(!await app.db.users.findOne({ id })) return res.status(404).send("User not registered")
        const user = client.users.resolve(id) || await client.users.fetch(id)
        if(!user) return res.status(404).send("User not found")
        const code = crypto.randomBytes(16).toString("hex")
        securityMapping[user.id] = code
        res.send(200)
    }
})

app.post("/api/register", async (req, res) => {
    const { id, publicKey } = req.body
    if(Number.isInteger(id)) {
        const user = client.users.resolve(id) || await client.users.fetch(id)
        if(!user) return res.status(404).send("User not found")
        if(await app.db.users.findOne({ id: user.id })) return res.status(400).send("User already registered")
        const payload = {
            id: user.id,
            publicKey
        }
        await app.db.users.insertOne(payload)
        const token = jwt.sign(payload, config.secret)
        res.status(200).send(token)
    }
})

app.post("/api/login/code", async (req, res) => {
    const { id, code } = req.body
    if(Number.isInteger(id)) {
        const validCode = securityMapping[id]
        if(!validCode) return res.status(404).send({ error: "User not found" })
        if(securityMapping[id] === code) {
            const token = jwt.sign(await app.db.users.findOne(id), config.secret)
            res.send(token)
        } else {
            res.status(401).send("Invalid code")
        }
    }
})

const verifyKey = async (req, res, next) => {
    jwt.verify(req.headers.authorization, config.secret, async (err, decoded) => {
        if(err) return res.status(401).send("Invalid token")
        req.user = decoded
        next()
    })
}

app.post("/api/sign", verifyKey, async (req, res) => {
    const { channel_id, content, message_id, signature } = req.body
    
    await app.db.messages.insertOne({
        channel_id,
        content,
        message_id,
        signed: new NodeRSA(req.user.publicKey).verify(signature, req.user.publicKey, "utf8", "base64")
    })
})

app.get("/api/verified/:messageId", verifyKey, async (req, res) => {
    const { messageId } = req.params
    const message = await app.db.messages.findOne({ message_id: messageId })
    if(!message) return res.status(404).send("Message not found")
    res.send(message.signed)
})

app.listen(3000, () => {
    console.log("Listening on port 3000")
    client.login(config.token)
})