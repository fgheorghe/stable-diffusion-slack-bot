A hastily implemented Slack chat bot for stable diffusion webui.

Requires: https://github.com/AUTOMATIC1111/stable-diffusion-webui

Then run the above with: ./webui.sh --api

Copy .env.sample to .env and configure your slack app.

This bot _only_ works on channels (not dms) and _must_ be invited to such channels.

It can be used with the following slack command: /prompt prompt

Requires ngrok for slack callbacks.
