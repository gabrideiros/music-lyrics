const cheerio = require('cheerio');
const request = require('superagent');

module.exports = async function (title) {

    try {

        const rest = await request.get(`https://www.google.com/search?q=${encodeURIComponent(title)}+letra`);

        const $ = cheerio.load(rest.text);

        const values = [];

        $("a").each(function (i, link) {

            let url = $(link).attr("href").replace("/url?q=", "").split("&")[0];

            if (url[0] === "/") return;

            if (!isLink(url)) return;

            values.push(url);

        });

        const link = values[0];

        if (!link) throw new Error("Error"); 

        const value = await find(link);

        return value;

    } catch (error) {
        throw new Error("Error")
    }


    async function find(link) {

        try {

            let lyric;

            const rest = await request.get(link);

            const $ = cheerio.load(rest.text);

            if (link.includes('https://www.letras.mus.br/') || link.includes('https://www.letras.com/')) {
                lyric = $('.cnt-letra.p402_premium').toString().replace(/<.*?>/g, "\n").trim();
            }

            else if (link.includes('https://www.letras.com.br/')) {
                lyric = $('.lyrics-section').toString().replace(/<.*?>/g, "\n").trim();
            }

            else if (link.includes('https://www.musixmatch.com/')) {
                lyric = $('.mxm-lyrics__content').toString().replace('</span>', '\n').replace(/<.*?>/g, '')
            }

            else if (link.includes('https://www.vagalume.com.br/')) {
                lyric = $('div[id="lyrics"]').toString().replace(/<.*?>/g, "\n").trim();
            }

            if (!lyric) throw new Error("Error"); 

            return lyric;

        } catch (error) {
            throw new Error("Error")
        }
    }

    function isLink(link) {

        const mus = 'https://www.letras.mus.br/';
        const letter = 'https://www.letras.com/';
        const letterbr = 'https://www.letras.com.br/';
        const musix = 'https://www.musixmatch.com/';
        const vagalume = 'https://www.vagalume.com.br/';

        const regex = /(https?:\/\/)?[a-z\.-]+\/.+/gi;

        return regex.test(link)
            && (link.includes(mus)
                || link.includes(letter)
                || link.includes(letterbr)
                || link.includes(musix)
                || link.includes(vagalume));
    }
}
