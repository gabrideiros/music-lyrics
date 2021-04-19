const cheerio = require('cheerio');
const request = require('request');
music = require('musicmatch')({ apikey: "437c67f675ff0dcff4e24ad7b403cbca" });

module.exports = async function (author, title) {

    return new Promise(function(resolve, reject) {
    
        music.matcherTrack({ q_artist: author, q_track: title })
        .then(function (data) {

            let url = data.message.body.track.track_share_url;

            request(url, async function (error, response, body) {
    
                if (!error && response.statusCode == 200) {

                    const value = cheerio.load(body);
    
                    resolve(value('.mxm-lyrics__content').toString().replace('</span>', '\n').replace(/<.*?>/g, ''));
                }
            });

        }).catch(function (err) {
            reject(err);
        });
    });
}
