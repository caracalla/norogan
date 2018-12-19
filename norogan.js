'use strict'

const youtube_regex = /(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)\&?/i;
const rogan_regex = /joe rogan/i;
const hi_regex = /^hi$/i;

const {google} = require('googleapis');

const minimum_his = 3;
const hi_chance = 0.4;


module.exports = class NoRogan {
  constructor(client, configs, logger) {
    this.client = client;
    this.configs = configs;
    this.logger = logger;
    this.hi_channel_map = {};
    this.youtube_service = google.youtube('v3');

    this.logger.info('norogan is now live')
  }

  process_message(message) {
    if (message.author.id === this.client.user.id) {
      return;
    }

    if (message.isMentioned(this.client.user)) {
      this.reply_to_mention(message);
    }

    if (hi_regex.test(message.content)) {
      this.say_hi(message);
    }

    if (rogan_regex.test(message.content)) {
      this.reply_to_rogan(message);
    }

    var youtube_match = youtube_regex.exec(message.content);

    if (youtube_match && this.find_youtube_video(youtube_match[1])) {
      this.reply_to_rogan(message);
    }
  }

  say_hi(message) {
    let channel_his = this.hi_channel_map[message.channel.name] || 0;
    channel_his += 1;

    if (channel_his >= minimum_his && Math.random() < hi_chance) {
      message.channel.send('hi');
      channel_his = 0;
    }

    this.hi_channel_map[message.channel.name] = channel_his;
  }

  reply_to_mention(message) {
    let random_index = Math.floor(Math.random() * this.configs.mention_responses.length);
    let bot_message = this.configs.mention_responses[random_index];

    message.react('👋');
    message.channel.send(bot_message);
  }

  reply_to_rogan(message) {
    let random_index = Math.floor(Math.random() * this.configs.rogan_responses.length);
    let bot_message = this.configs.rogan_responses[random_index];

    message.react('🙅');
    message.channel.send(bot_message)
      .then((new_message) => new_message.react('🔑'))
      .catch((failed_message) => logger.error(`failed to send: ${failed_message.content}`));
  }

  find_youtube_video(video_id) {
    this.youtube_service.videos.list({
      key: this.configs.youtube.key,
      id: video_id,
      part: 'snippet'
    }, (err, response) =>  {
      if (err) {
        this.logger.error('YouTube API error for video id: ' + video_id);
        return;
      }

      var videos = response.data.items;
      if (videos.length === 0) {
        this.logger.error('No video found for video id: ' + video_id);
        return;
      }

      var video_info = videos[0].snippet;

      this.logger.info('video posted: ' + video_info.title);

      if (rogan_regex.test(video_info.title)) {
        return true;
      }
    })
  }
}
