const config = require("./config.json")
const log4js = require('log4js')
const logger = log4js.getLogger("<LOG>")
const loggerBOT = log4js.getLogger("<BOT>")
const loggerTASK = log4js.getLogger("<TASK>")
const loggerCMD = log4js.getLogger("<CMD>")
const loggerCHAT = log4js.getLogger("<CHAT>")
logger.level = 'all'
loggerBOT.level = 'all'
loggerTASK.level = 'all'
loggerCMD.level = 'all'
loggerCHAT.level = 'all'
const fs = require("fs")

const discord = require('discord.js');
const client = new discord.Client({
    intents: new discord.Intents(32767),
    // ws: { properties: { $browser: "Discord iOS" } }
});
const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));

process.on('uncaughtException', function(err) {
    console.log(err);
})

client.once("ready", async() => {
    task()
        /** command TYPE is
         *  BOOLEAN
         *  CHANNEL
         *  INTEGER
         *  MENTIONBLE
         *  NUMBER
         *  ROLE
         *  STRING
         *  SUB_COMMAND
         *  SUB_COMMAND_GROUP
         *  USER
         *   Constants.ApplicationCommandOptionTypes.CHANNEL
         */

    if (config.debug) { config.commands.forEach(d => { logger.debug(d) }) }
    //グローバルコマンド設定 コマンドを頻繁に変更しない場合はこっちを使うことを推奨
    client.guilds.cache.forEach(async guild => {
            //     await guild.commands.set([]);
            //     loggerTASK.info(guild.name+" has been RESET")
            await guild.commands.set(config.commands);
            loggerTASK.info(guild.name + " has been set application command")
        })
        // loggerTASK.info("ALL Guild set application");

    // await client.application.commands.set(config.commands);
    // loggerTASK.info("Global set application Ready!");
});

client.on('ready', async() => {
    loggerTASK.info("BOT logined to discord")
    let guildNum = 0
    let channelNum = 0
    client.guilds.cache.forEach(() => guildNum++) //bot参加サーバー数
    client.channels.cache.forEach(() => channelNum++) //参加しているサーバーにあるすべてのチャンネル数
    loggerBOT.info(`GUILDnum: ${guildNum} CHANNELnum: ${channelNum}`)
});

client.on('messageCreate', async(message) => {
    if (message.author.bot) { return }
    if (config.debug && !(message.content == "")) { loggerCHAT.debug(`[${message.guild.name}][${message.channel.name}]<${message.author.username}#${message.author.discriminator}> ${message.content}`) }
})


client.login(config.token);