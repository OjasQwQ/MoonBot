require("dotenv").config();

const { App } = require('@slack/bolt');
const axios = require("axios");

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    appToken: process.env.SLACK_APP_TOKEN,
    socketMode:true
})

app.command("/moonbot-ping",async({command,ack,respond})=>{
    const start=Date.now();
    await ack();
    const latency= Date.now() - start;
    await respond({ text: `Pong!\nLatency: ${latency}ms`});
});

app.command("/moonbot-help",async({ack,respond}) => {
    await ack();
    await respond({
        text:
        `Available Commands:
        /moonbot-ping - Check bot latency
        /moonbot-moonfact - Get a moon fact`
    })
})

app.command("/moonbot-spacepic",async({ack,respond}) => {
    await ack();

    try{
        const response = await axios.get("https://nasa.gov");
        const spaceData =  response.data[0];

        await respond({
            blocks: [
                {
                    type:"section",
                    text: {
                        type: "mrkdwn",
                        text: `*${spaceData.title}*`
                    }
                },
                {
                    type: "image",
                    title: {
                        type: "plain_text",
                        text: spaceData.Data.title
                    },
                    image_url: spaceData.url,
                    alt_text: spaceData.title
                },
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: spaceData.explanation
                    }
                }
            ]
        });
    } catch(err) {
        await respond({ text: "Failed to fetch images from NASA."});
    }
});

app.command("/moonbot-joke", async({ack,respond}) => {
    await ack();

    try{
        const response = await axios.get("https://official-joke-api.appspot.com/random_joke");
        await response({
            text:
            `${response.data.setup}`
            `${response.data.punchline}`
        });
    } catch(err) {
        await respond({ text: "Failed to fetch some humour."});
    }
})

(async () => {
    await app.start();
    console.log("bot is running!");
})();