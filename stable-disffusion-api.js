const axios = require('axios');

class StableDiffusionApi {
    constructor(url) {
        this.url = url;
    }

    async generateImage(prompt) {
        return axios.post(this.url + '/sdapi/v1/txt2img', prompt);
    }
}

module.exports = StableDiffusionApi;