const fs = require('fs');
const { createSession } = require('./create_session');

/*
Мы создаем новый экземпляр клиента Telegram.
Функция принимает на вход объект конфигурации, который должен содержать информацию о сеансе пользователя (config.USER.SESSION),
идентификатор API (config.USER.API_ID) и хэш API. (config.USER.API_HASH).
Мы используем библиотеку prompt для обработки входных данных консоли.
в конце мы вызываем функцию из bot_commands.ts, которую собираемся создать в следующем файле.
*/

(async () => {
    console.log("Bot starting");
    createSession();
})();
