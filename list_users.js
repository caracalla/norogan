'use strict'

// set up logging
const winston = require('winston');
const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'norogan.log' })
  ]
});


// configuration
const configs = require('./config.json');
const secrets = require('./secrets.json');
Object.assign(configs, secrets);


// set up discord client
const Discord = require('discord.js');
const client = new Discord.Client();
const discord_token = secrets.discord.token;

logger.info('starting up');

client.once('ready', () => {
  logger.info('discord client is ready');
});

client.login(discord_token).then(() => {
  logger.info(`logged in as: ${client.user.tag})`);

  client.guilds.forEach((guild) => {
    logger.info(`Server name: ${guild.name}`);

    guild.members.forEach((member) => {
      logger.info(`  User name: ${member.displayName}, id: ${member.id}`);
    });
  });

  process.exit(0);

  client.on('error', (error) => {
    logger.error('I had an error');
    logger.error(error);
  });
}).catch((error) => {
  logger.error(`failed to login: ${error}`);
  process.exit(1);
});



// process control
const clean_up = async(exit_code) => {
  await client.destroy();
  logger.info('norogan is no more');
  process.exit(exit_code);
};

process.once('exit', clean_up);
process.once('SIGINT', clean_up);
process.once('SIGTERM', clean_up);
process.once('unhandledRejection', (async (reason, promise) => {
    console.log('Unhandled promise rejection at: Promise', promise, 'reason:', reason);
    await clean_up(0);
}));
process.once('uncaughtException', async error => {
    console.log(error.stack);
    await clean_up(0);
});
