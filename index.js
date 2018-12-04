var Discord = require('discord.io');
var winston = require('winston');
var discord_auth = require('./discord_auth.json');
var youtube_auth = require('./youtube_auth.json');
var {google} = require('googleapis');
var youtube_service = google.youtube('v3');

const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'norogan.log' })
  ]
});

logger.debug('norogan is live');

var youtube_regex = /(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)\&?/gi;
var rogan_regex = /joe rogan/gi;

// Initialize Discord Bot
var bot = new Discord.Client({
  token: discord_auth.token,
  autorun: true
});

bot.on('ready', function (evt) {
  logger.info('Connected');
  logger.info('Logged in as: ');
  logger.info(bot.username + ' - (' + bot.id + ')');
});

bot.on('message', function (user, userID, channelID, message, evt) {
  logger.info(message);

  youtube_regex.lastIndex = 0; // js is stupid as hell
  var match_info = youtube_regex.exec(message);

  if (match_info) {
    var video_id = match_info[1];

    youtube_service.videos.list({
      key: youtube_auth.key,
      id: video_id,
      part: 'snippet'
    }, function (err, response) {
      if (err) {
        logger.error('YouTube API error for video id: ' + video_id);
        return;
      }

      var videos = response.data.items;
      if (videos.length === 0) {
        logger.error('No video found for video id: ' + video_id);
        return;
      }

      var video_info = videos[0].snippet;

      logger.info('video posted: ' + video_info.title);

      if (rogan_regex.test(video_info.title)) {
        logger.info('it is a joe rogan video')

        bot.sendMessage({
          to: channelID,
          message: 'WARNING! JOE ROGAN VIDEO!'
        });
      }
    })
  }
});
