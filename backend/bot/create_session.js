const fs = require('fs');
const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const prompt = require('prompts');
const { bot_start } = require("./bot_commands");

const readConfig = () => {
  const saved = fs.readFileSync('./src/config.json', 'utf8');
  return JSON.parse(saved);
}

const createSession = async () => {
  const config = readConfig();

  const client = new TelegramClient(
    new StringSession(config.USER.SESSION),
    parseInt(config.USER.API_ID),
    config.USER.API_HASH, {
      connectionRetries: 5,
    }
  );

  await client.start({
    phoneNumber: async () => (await prompt({ type: 'text', name: 'phoneNumber', message: 'Enter your number' })).phoneNumber,
    password: async () => (await prompt({ type: 'text', name: 'password', message: 'Enter your 2FA password' })).password,
    phoneCode: async () => (await prompt({ type: 'text', name: 'phoneCode', message: 'Enter security code from Tg or SMS' })).phoneCode,
    onError: (err) => console.log(err),
  });

  if ((config.USER.SESSION).length < 1) {
    console.log("Creating user session");
    // when session is created you will get saved session there fill it
    // to prevent login again
    await client.sendMessage("me", { message: "String session generated on this account for userbot your string session is \n`" + client.session.save() + "`"});
  } else {
    console.log("Starting bot")
  }
  await bot_start(client)
}

module.exports = { createSession }
