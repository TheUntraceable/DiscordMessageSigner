# DiscordMessageSigner

## What is it?
Every felt like you're account has messages being sent by someone who isn't you? Ever felt like you're just going crazy and it's just you? Here's your solution!

### Discord-RPC
To start explaining, Discord-RPC (not to be confused with [whatever this is](https://github.com/Discord/Discord-RPC)) is something that uses *your* Discord Client (don't worry, this isn't a selfbot so you ***won't*** risk being ban at all).

The application will listen to messages in all channels, and if the message is sent by you, it will send a request to the API with the signed message, and the API will keep a log of this, and verify the signature. If it does not verify, you will be alerted.

## What does it do?
Using the RSA algorithm, it signs a message with your private key and sends it to the API. It will verify the signature. Unfortunately, I don't have the powers of stopping the message from being sent (yet?). Within the application, you can view messages that have been sent by you. There will be a place where you can view the messages that have been verified, and those that are unverified. 

## How do I get started?
At the very least, you *need* to have NodeJS installed, v18.8 is what *I* use, and it works, so I would recommend that. You can get it [here](https://nodejs.org/en/).
Along with this, you need a Discord account... if you don't have that, then it won't work for some odd reason I am yet to conclude

To get started, you'll need to have an application created on the [Discord Developer Portal](https://discord.com/developers/applications).

After this you need to generate a public and private key. You can do this by using the [RSA Key Generator](https://travistidwell.com/jsencrypt/demo/). You'll need to generate a 2048 bit key. After this, you'll need to copy the public key and private key, these will be used in the config.

Then, run `npm i` to install all the dependencies.

With all your information ready, go to the `src` directory, and run `node setup.js`, fill in all information.

The private key is used for signing the messages, and is never stored server-side, so you don't need to worry about it being leaked.
The public key, on the other hand, is used for verifying the messages, and is stored server-side. This is not an issue as *public* keys can be shown to anyone with no issue.
If you change the private key, the server will not know, and thus will not be able to verify the messages, and all messages wil be marked as unverified.
If you change the public key, the server will understand, but if you *only* change the public key, and not the private key, it will also mark all messages as unverified.

TL;DR: Keep your keys synced.

After this, you need to create 2 more files, `token.json`, and `database.sqlite`. Inside of the `token.json` file, add in `{}`. You don't need to do anything after this, the application uses this internally.

After you setup your config, you can run the application. You can run it by using `npm start`.

## Why?
I was using Git's GPG signing, and I thought it would be cool to have a similar thing for Discord. I can see this being used by a broad audience, and wouldn't look too bad on my resume.

## How do I contribute?
If you want to contribute, you can fork the repository, and make a pull request. I will review it, and if it's good, I will merge it.