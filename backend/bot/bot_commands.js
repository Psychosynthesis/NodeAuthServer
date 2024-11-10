const { Api } = require("telegram");
const { NewMessage, NewMessageEvent } = require("telegram/events/NewMessage");

let client;

const commands = {
  "ping": async (msg) => {
            console.log('start ping');
            const start = Date.now();
            console.log('msg.edit is: ',  msg.edit);
            await msg.edit({ text: '`!....`' });
            await new Promise(resolve => setTimeout(resolve, 300));
            await msg.edit({ text: '`..!..`' });
            await new Promise(resolve => setTimeout(resolve, 300));
            await msg.edit({ text: '`....!`' });
            const end = Date.now();
            const m_s = ((end - start) - 600) / 3;
            await msg.edit({ text: `Average Pong: \n\`${m_s.toFixed(3)} ms\`` });
            console.log(`Average Pong: \n\`${m_s.toFixed(3)} ms\``);
            console.log('ping end');
          },
  "showMeta": (msg) => {
            console.log('Detect new message from me: ', msg);
          },
  "editMessage": async (msg) => {
            const peer = await client.getInputEntity(msg.peerId.userId);
            const result = await client.invoke(
              new Api.messages.EditMessage({
                peer: peer,
                id: msg.id,
                message: "Hello there!",
              }));
          }
};

async function listenMessageEvent({ message }) {
    const me = await client.getMe();
    const { text, senderId } = message;
    if (senderId?.equals(me.id)) {
      const [cmd, ...args] = text.split(' ');
      if (cmd.startsWith('/') && (cmd.slice(1) in commands)) {
        console.log('Command detected: ', cmd.slice(1));
        await commands[cmd.slice(1)](message);
      }
    }
}

var bot_start = async (mClient) => {
    console.log("Bot started successfully");
    client = mClient;
    mClient.addEventHandler(listenMessageEvent, new NewMessage({}));
}

/*
Функция bot_start инициализирует бота, настраивая обработчик событий и запуская бота.
Функция ListenMessageEvent прослушивает новые сообщения и проверяет, являются ли они командами,
распознаваемыми ботом. Если да, то он вызывает соответствующую функцию.
В пользовательском боте реализована только функция ping, которая отправляет в чат серию сообщений
с задержкой между ними и рассчитывает среднее время ответа.
*/

module.exports = { bot_start }
