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
        const response = await axios.get("https://images-api.nasa.gov/search", {
            params: {
                q: "nebula galaxy universe stars",
                media_type: "image",
                page_size: 100
            }
        });
        const items = response.data.collection.items.filter(item =>
            item.data?.[0] &&
            item.links?.some(link => link.render === "image" && link.href.endsWith(".jpg"))
        );
        if (!items.length) {
            throw new Error("NASA returned no images");
        }

        const item = items[Math.floor(Math.random() * items.length)];
        const spaceData = item.data[0];
        const imageLink = item.links.find(link =>
            link.render === "image" && link.href.endsWith(".jpg")
        );

        await respond({
            blocks: [
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: `*${spaceData.title}*`
                    }
                },
                {
                    type: "image",
                    title: {
                        type: "plain_text",
                        text: spaceData.title.slice(0, 150)
                    },
                    image_url: imageLink.href,
                    alt_text: spaceData.title.slice(0, 150)
                },
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: (spaceData.description || "NASA image of the universe.")
                            .slice(0, 3000)
                    }
                }
            ]
        });
    } catch(err) {
        await respond({ text: "Failed to fetch images from NASA."});
    }
});

app.command("/moonbot-moonfact", async({ack,respond}) => {
    await ack();
    const facts = [
        "The Moon is Earth's only natural satellite.",
        "The Moon is about 384,400 km from Earth on average.",
        "The Moon has no atmosphere, so its sky appears black even during the day.",
        "A day on the Moon lasts about 29.5 Earth days.",
        "The Moon is moving away from Earth at about 3.8 cm per year."
    ];
    await respond({ text: facts[Math.floor(Math.random() * facts.length)] });
});

app.command("/moonbot-joke", async({ack,respond}) => {
    await ack();

    try{
        const response = await axios.get("https://official-joke-api.appspot.com/random_joke");
        await respond({
            text: `${response.data.setup}\n${response.data.punchline}`
        });
    } catch(err) {
        await respond({ text: "Failed to fetch some humour."});
    }
});

app.command("/astronauts", async({ command,ack,respond }) => {
    await ack();

    try{
        const response = await axios.get("http://open-notify.org");
        const totalNumber = response.number;
        const names = response.people.map(package => " ${p.name} (${p.craft}").join("\n");

            await respond({
                text: "There are currently *${totalNumber}* humans in space right now! \n\n${names}"
            });
    } catch(error) {
        await respond("Lost connection to the space station. Try again later!")
    }

})

(async () => {
    await app.start();
    console.log("bot is running!");
})();