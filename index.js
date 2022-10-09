const rate_limit = 1 // higher is faster.
const token_length = 5

const song_url = "https://soundcloud.com/lildvrkie/s"
const bare_server = "https://uv.moderategarden.mom/"







const bare = require('@tomphttp/bare-client');

const crypto = require("node:crypto");
const util = require("node:util");


async function gen(length) {
    const random = util.promisify(crypto.randomInt);
    var result = "";

    const validChars = 
          "0123456789"
        + "abcdefghijklmnopqrstuvwxyz"
        + "ABCDEFGHIJKLMNOPQRSTUVWXYZ" 
        // + ",.-{}+!\"#$%/()=?";

    for (let i = 0; i < length; i++) {
        result += validChars[await random(0, validChars.length)];
    }

    return result;
}

async function request(id) {
    try {
        bare(`${bare_server}`).then(async (client) => {
            const res = await client.fetch(`https://api-v2.soundcloud.com/resolve?url=${song_url}/s-${id}&format=json&client_id=gsPNGqVqXY4QlaFqDv7WBWglYHdTPsh6`);
        
            if (!res.ok) {
                console.error(`${song_url}/s-${id}`, res.status, await res.text());
                return;
            }
    
            if (res.ok) {
                console.error(`${song_url}/s-${id}`, res.status, await res.text());
                process.exit()
            }
        });
        
    } catch (err) {
        console.error("Caught", err);
        // re-attempt
        await request(id);
    }
}

async function main() {
    for (;;) {
        const queue = [];

        for (let i = 0; i < rate_limit; i++) {
            queue.push(request(await gen(token_length)));
        }

        // wait for the batch of 10 to finish before sending another batch
        await Promise.all(queue);
    }
}

main();
