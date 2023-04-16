const {App} = require("@slack/bolt");
const axios = require('axios');
const StableDiffusionApi = require('./stable-disffusion-api');
require("dotenv").config();

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    appToken: process.env.SLACK_APP_TOKEN,
    socketMode: true
});

// Create Leap api client.
const stableDiffusionApi = new StableDiffusionApi("http://localhost:7860");

// Start slack app.
(async () => {
    const port = 8000;
    // TODO: Use ngrok http 8000 for callback URLs to avoid these types of error messages:
    // /prompt failed with the error "dispatch_failed".
    await app.start(port);
    console.log(`Bot running.`);
})();

// Serves /prompt "prompt string" commands.
app.command("/prompt", async ({command, ack, say}) => {
    try {
        // Get prompt string.
        const prompt = command.text;

        // Send an ack response.
        console.log(`Prompt in: ${prompt}`);
        await say(`Your input prompt: ${prompt}`);

        // Issue request to leap. Uncomment the following lines to issue a real request.
        const result = await stableDiffusionApi.generateImage({
            prompt
        });

        // Only output text when we have results.
        if (result && result.data && result.data.images) {
            const imageCount = result.data.images.length;

            console.log(`Prompt returned: ${imageCount} image(s).`);
            say(`Results in for: ${imageCount} image(s).`);

            // Download each image and post it to slack.
            for (let i = 0; i < result.data.images.length; i++) {
                // Generate a random 'filename'.
                const filename = Math.floor(Math.random() * 10000000) + ".png";

                // Issue a leap get request.
                const file = Buffer.from(result.data.images[i], 'base64');

                // Post to slack.
                await app.client.files.uploadV2({
                    filename,
                    file,
                    initial_comment: prompt,
                    channel_id: command.channel_id
                });
            }

            console.log('Done.');
            say("Done.");
        }
    } catch (error) {
        console.log("[-] Error: ");
        console.error(error);
    }

});
