const cheerio = require('cheerio');
const request = require('superagent');

module.exports = async function (title) {

    try {

        const rest = await request.get(`https://www.google.com/search?q=${encodeURIComponent(title)}+letra`);

        const $ = cheerio.load(rest.text);

        const values = [];

        links = $("a");

        links.each(function (i, link) {

            let url = $(link).attr("href");

            url = url.replace("/url?q=", "").split("&")[0];

            if (url.charAt(0) === "/") {
                return;
            }

            if (!isLink(url)) return;

            values.push(url);

        });

        const val = await find(values[0]);

        return val;

    } catch (error) {
        console.log(error);
    }


    async function find(link) {

        try {

            let lyric;

            const rest = await request.get(link);

            const $ = cheerio.load(rest.text);

            if (link.includes('https://www.letras.mus.br/')) {
                lyric = $('.cnt-letra.p402_premium').toString().replace(/<.*?>/g, "\n").trim();
            }

            else if (link.includes('https://www.musixmatch.com/')) {
                lyric = $('.mxm-lyrics__content').toString().replace('</span>', '\n').replace(/<.*?>/g, '')
            }

            else if (link.includes('https://www.vagalume.com.br/')) {
                lyric = $('div[id="lyrics"]').toString().replace(/<.*?>/g, "\n").trim();
            }

            return lyric;

        } catch (error) {
            console.log(error);
        }
    }

    function isLink(link) {

        const mus = "https://www.letras.mus.br/";
        const musix = "https://www.musixmatch.com/";
        const vagalume = "https://www.vagalume.com.br/";

        const regex = /(https?:\/\/)?[a-z\.-]+\/.+/gi;

        return regex.test(link)
            && (link.includes(mus)
                || link.includes(musix)
                || link.includes(vagalume));
    }

}
