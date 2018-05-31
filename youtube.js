const request = require('request');
const { youtubeApiToken } = require('./config.json');

const API_KEY = youtubeApiToken;
const WATCH_VIDEO_URL = "https://www.youtube.com/watch?v=";

exports.watchVideoUrl = WATCH_VIDEO_URL;

exports.search = async function search(searchKeywords, callback) {
    var requestUrl = 'https://www.googleapis.com/youtube/v3/search' + `?part=snippet&q=${escape(searchKeywords)}&key=${API_KEY}`;

    await request(requestUrl, (error, response) => {
        if (!error && response.statusCode == 200) {

            var body = response.body;
            if (body.items.length == 0) {
                console.log("Your search gave 0 results");
                return;
            }

            for (var item of body.items) {
                if (item.id.kind === 'youtube#video') {
                    callback(item.id.videoId, item.snippet.title);
                    return; // prevent adding entire list of youtube videos
                }
            }
        }
        else {
            console.log("Unexpected error when searching YouTube");
            return;
        }
    });

    return;
};
