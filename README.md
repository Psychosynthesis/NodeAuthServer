# `Express.js + MongoDB` Auth Server Template

Шаблон сервера на Express.js с авторизацией и простейшим интерфейсом. В интерфейсе разделены компоненты логина и основного приложения, что исключает получение кода основного приложения без авторизации.

_Обратите внимание_, данный шаблон - это всего лишь отправная точка, с которой можно начать разработку собственного сервиса. Он не предназначен для использования в продакшне как есть, поскольку настройки, определяющие гибкость его архитектуры и уровень его безопасности, зависят от потребностей конкретного приложения и должны быть реализованы вручную.

Также _обратите внимание_, что в коде имеется несколько `console.log` для помощи в процессе разработки приложения. В продакшне они не нужны. В производственном режиме также не следует возвращать столь информативные `message`.

Если возможностей, реализованных в шаблоне, окажется недостаточно, можно использовать [`Auth0`](https://auth0.com/), это полноценная платформа для аутентификации/авторизации.

В качестве базы данных использована [`MongoDB`](https://ru.wikipedia.org/wiki/MongoDB) и ORM `mongoose`.

Настройка MongoDB в данном описании не рассматривается.

Чтобы использовать [`Sentry`](https://sentry.io/welcome/) (в продакшне) нужно добавить `SDK` для интеграции с Sentry:
```
"@sentry/node": "^6.14.3",
"@sentry/tracing": "^6.14.3",
```


Список технологий чуть подробнее:

- [`nodemon`](https://www.npmjs.com/package/nodemon) - утилита для запуска сервера для разработки
- [`mongoose`](https://www.npmjs.com/package/mongoose) - [`ORM`](https://ru.wikipedia.org/wiki/ORM) для `MongoDB`. [Здесь](https://github.com/harryheman/React-Total/blob/main/md/mongoose.md) вы найдете руководство по работе с этой `ORM`
- [`jsonwebtoken`](https://www.npmjs.com/package/jsonwebtoken) - утилита для работы с токенами. [Здесь](https://github.com/harryheman/React-Total/blob/main/md/jsonwebtoken.md) вы найдете шпаргалку по работе с этой утилитой
- [`helmet`](https://www.npmjs.com/package/helmet) - утилита для установки `HTTP-заголовков`, связанных с безопасностью. [Здесь](https://github.com/harryheman/React-Total/blob/main/md/helmet.md) вы найдете шпаргалку по работе с этой утилитой, а [здесь](https://github.com/harryheman/React-Total/blob/main/md/security/security.md) - шпаргалку и туториал по заголовкам безопасности
- [`cors`](https://www.npmjs.com/package/cors) - утилита для установки `HTTP-заголовков`, связанных с [`CORS`](https://developer.mozilla.org/ru/docs/Web/HTTP/CORS). [Здесь](https://github.com/harryheman/React-Total/blob/main/md/cors.md) вы найдете шпаргалку по работе с этой утилитой
- [`cookie-parser`](https://www.npmjs.com/package/cookie-parser) - утилита для разбора куки, содержащихся в запросе
- [`cross-env`](https://www.npmjs.com/package/cross-env) - утилита для установки переменных среды окружения


Алгоритм локального запуска проекта:

- Переходим в директорию и устанавливаем зависимости:

```bash
cd NodeAuthServer/backend
npm i
```

- Устанавливаем значения содержащихся в `backend\config\index.example.js` переменных. Для режима разработки достаточно установить значение переменной `MONGODB_URI`. Для производственного режима также необходимо установить значение переменной `SENTRY_DSN` (если вы планируете использовать этот сервис).
- Значения переменных `VERIFICATION_CODE` (в файле `commons\config.json`) и `ACCESS_TOKEN_SECRET` в продакшне должны быть случайными строками. Эти переменные являются общими для сервера и клиента. При использовании на клиенте они должны оставаться скрытыми (`REACT_APP_VERIFICATION_CODE`, например). Значения этих переменных должны периодически обновляться.

- Генерируем ключи (см. ниже):

```bash
npm run gen
```

Ключи также должны периодически обновляться (ротация ключей, key rotation).

- Запускаем сервер для разработки:

```bash
npm run dev
```

- Запускаем сервер для продакшна:

```bash
npm start
```

## Структура проекта

Проект имеет следующую структуру:

```bash
- `config` - Обычно, переменные среды окружения помещаются в файл `.env`, но можно использовать и такой вариант, главное, не забыть указать `config` в `.gitignore`
 - `index.js`
- `middlewares` - посредники, промежуточный слой
 - `index.js` - агрегация и повторный экспорт посредников
 - `setCookie.js` - для генерации токенов обновления и доступа
 - `setSecurityHeaders.js` - для установки заголовков безопасности, используется вместо `helmet` (вы должны понимать, что делаете)
 - `verifyAuth.js` - для проверки аутентификации
 - `verifyAccess.js` - для проверки авторизации
 - `verifyPermission.js` - для дополнительной проверки полномочий пользователя
- `models`
 - `User.js` - модель пользователя для `mongoose`
- `routes`
 - `app.routes.js` - роуты приложения
 - `auth.routes.js` - роуты аутентификации/авторизации
- `services`
 - `auth.services.js` - сервисы аутентификации/авторизации
- `utils` - утилиты
 - `generateKeyPair.js` - для генерации публичного и приватного ключей (запускается при выполнении команды `yarn gen`)
 - `token.js` - для подписания и проверки токенов
- `server.js` - основной файл сервера
- ...
```

Роуты, реализованные в приложении:

```bash
- `api/`
 - `/auth`
   - `/register` - регистрация нового пользователя
   - `/login` - авторизация пользователя (вход в систему), получение токенов
   - `/getUser` - получение данных аутентифицированного пользователя
   - `/logout` - выход из системы
   - `/remove` - удаление пользователя
   - `/updateToken` - обновление обоих токенов (для этого используется токен обновления);
```

Далее немного базовой теории о принципах авторизации.


## Токен

Под токеном в данном шаблоне подразумевается [`JSON Web Token`](https://jwt.io/).

`JWT` - это открытый стандарт ([`RFC 7519`](https://datatracker.ietf.org/doc/html/rfc7519)), определяющий компактный и автономный способ безопасной передачи данных между сторонами в виде объекта формата `JSON`.

Благодаря относительно небольшому размеру `JWT` может передаваться через `URL`, тело `POST-запроса`, `HTTP-заголовок` и т.д. Валидация токена выполняется только на сервере.

`JWT` может использоваться для:

- аутентификации: при успешном входе пользователя в систему возвращается токен идентификации;
- авторизации: одновременно с токеном идентификации или вслед за ним пользователю предоставляется токен доступа, который в дальнейшем прикрепляется к каждому запросу пользователя на доступ к защищенным ресурсам;
- обмена информацией: токены отлично подходят для обмена "секретными" сообщениями.

Информация содержащаяся в токене, может быть проверена и является доверенной благодаря цифровой подписи (digital sign). Шифрование токена применяется редко, хотя такая возможность имеется (речь идет о шифровании содержимого токена). В шаблоне используются подписанные токены (signed tokens).

Токен может быть подписан с помощью секрета (secret) (алгоритм [`HMAC`](https://ru.wikipedia.org/wiki/HMAC)) или с помощью публичного и приватного ключей (public/private key pair) (алгоритм [`RSA`](https://ru.wikipedia.org/wiki/RSA)). В шаблоне используются оба варианта (просто для примера). Когда токен подписан с помощью приватного ключа, он может быть подтвержден (проверен, verify) только стороной, владеющей публичным ключом.

Перед использованием токена выполняется проверка его сигнатуры (signature). Проверка заключается в определении отсутствия изменений. Это не означает, что никто не сможет увидеть содержимое токена, поскольку оно хранится в виде обычного текста. Поэтому в токене нельзя хранить чувствительную информацию, такую как пароль пользователя.

__Структура токена__

Токен состоит из трех частей, представляющих собой закодированные `base64-строки`, разделенные точками (`.`):

- `JOSE Header`: содержит данные о типе токена и криптографическом алгоритме, использованным для его подписания

```json
{
 "alg": "HS256",
 "typ": "JWT"
}
```

- `JWS Payload` (настройки или заявки, claims): проверяемые инструкции безопасности, такие как идентичность пользователя и его полномочия

```json
{
 "sub": "1234567890",
 "name": "John Doe",
 "admin": true
}
```

- `JWS signature`: используется для проверки того, что токен не был модифицирован и поэтому является доверенным

```bash
HMACSHA256(
 base64UrlEncode(header) + "." +
 base64UrlEncode(payload),
 secret
)
```

__Виды токенов__

Существует 3 основных вида токенов: токен идентификации, токен доступа и токен обновления (Refresh Token). В шаблоне токен идентификации как таковой не используется.

Токен идентификации используется только приложением. Такие токены не должны использоваться для доступа к `API`. Каждый токен идентификации содержит информацию, предназначенную для определенной аудитории (audience), которой обычно является адресат (получатель, recipient) токена.

Согласно спецификации [`OpenID Connect`](https://openid.net/connect/) аудиторией токена идентификации (указанной в настройке `aud`) должен быть идентификатор клиента (client ID), выполняющего запрос на аутентификацию. Если это не так, токен считается не заслуживающим доверия. Наличие идентификатора клиента означает, что только данный клиент должен потреблять (consume) этот токен.

Токен доступа используется для уведомления `API` о том, что его предъявитель (bearer) имеет доступ к `API`, т. е. выполнил все необходимые действия в соответствии со сферами доступа (`scopes`).

Токены доступа не должны использоваться для аутентификации. Обычно в такой токен включается только идентификатор клиента (настройка `sub`).

Токен обновления, как следует из названия, используется для обновления токена доступа без принуждения пользователя к повторной аутентификации, т.е. автоматически.

__Правила использования токенов и алгоритмы подписи__

_Правила_

Общие рекомендации по использованию токенов могут быть сведены к следующему:

- секретность означает безопасность: ключ, используемый для подписания токена, должен быть скрытым;
- токен не должен содержать чувствительных данных пользователя;
- токен должен иметь ограниченное время жизни (expiration): технически после подписания токен является валидным до тех пор, пока не изменится ключ, использованный для его подписания, или пока не истечет время его жизни;
- для передачи токена должно использоваться только `HTTPS-соединение`: в противном случае, токен может быть перехвачен и скомпрометирован;
- при необходимости для проверки токенов должна использоваться вторичная система верификации;
- с целью уменьшения количества запросов к серверу следует предусмотреть возможность временного хранения токенов на стороне клиента (в шаблоне это реализовано с помощью куки - для токена обновления, для токена доступа на клиенте следует использовать `sessionStorage` (но не `localStorage`) или просто хранить токен в памяти).

_Алгоритмы_

Для подписания токенов обычно используются следующие алгоритмы:

- `RS256` (сигнатура `RSA` с `SHA-256`): алгоритм ассиметричного шифрования - у нас имеется 2 ключа, публичный и приватный, приватный ключ должен храниться в секрете. Для подписания токена используется приватный ключ, а для его проверки - публичный;
- `HS256` (`HMAC` с `SHA-256`): алгоритм симметричного шифрования - у нас имеется только один ключ, который используется и для подписания токена, и для его проверки. Этот ключ должен храниться в секрете.

`RS256` считается более безопасным.

В шаблоне для подписания токена обновления используется `RS256`, а для подписания токена доступа `HS256`.

Дополнительная [информация о JWT](https://betterprogramming.pub/jwt-ultimate-how-to-guide-with-best-practices-in-javascript-f7ba4c48dfbd).


## Логика авторизации:

Для регистрации на сервер отправляется `POST-запрос` по адресу `/api/auth/register`. Тело запроса должно содержать имя, адрес электронной почты, пароль пользователя. Сервер проверяет наличие пользователя с указанным именем или email в БД. Если пользователь новый, его пароль хешируется, после чего данные пользователя записываются в БД и в `req.user`.

Для авторизации приложение отправляет post-запрос на адрес `/api/auth/login` с username и паролем пользователя. В процессе авторизации
сервер проверяет существование пользователя и сверяет пароль. Если данные верны, сервер подписывает токен доступа и токен обновления.
Токен обновления зашивается в куку, передаваемую только по HTTPS и доступную только на сервере, а токен доступа и данные пользователя
возвращаются клиенту. Также сервер сохраняет время последнего логина чтобы иметь возможность принудительного выхода из системы.

Токен обновления подписывается с помощью `RS256` и содержит только `ID` пользователя.

Токен доступа подписывается с помощью `HS256` и содержит `ID` пользователя и его роль (role). Время его жизни составляет `1 час`. Теоретически это очень много, такое время жизни должно использоваться только при разработке приложения, в продакшне оно должно составлять `5-10 мин`, однако чтобы реализовать постоянное обновление, нужно учесть это в коде клиентской части приложения.

Время жизни токенов зависит от потребностей приложения. Общее правило таково: чем меньше время жизни токена, тем лучше.

Для выхода из системы на сервер отправляется `GET-запрос` по адресу `/api/auth/logout`. Данный запрос проходит через посредника `verifyAccess` (обращение к данной конечной точке представляет собой обращение к защищенному ресурсу ). Посредник `verifyAccess` проверяет наличие и время жизни токена доступа.

Если токен в порядке, он декодируется, его содержимое записывается в `req.user` и управление передается сервису `logoutUser`. Все, что делает данный сервис - это очищает куку, содержащую токен обновления, а также сбрасывает время начала сессии у пользователя, чтобы никто не мог зайти по старому токену обновления в случае если он не просрочен.

_Обратите внимание_: после ответа сервера об успешном выходе из системы клиент должен обнулить токен доступа на своей стороне.

Если время жизни токена доступа истекло, возвращается статус `401` и соответствующее сообщение. В этом случае клиент выполняет запрос на получение данных пользователя, в результате которого подписывается новый токен доступа, после чего запрос на выход из системы повторяется.

При удалении пользователя на сервер отправляется `DELETE-запрос` по адресу `/remove`. Данный запрос последовательно проходит через посредников `verifyAccess` и `verifyPermission` (обращение к данной конечной точке также представляет собой обращение к защищенному ресурсу - просто для примера).

Посредник `verifyPermission` проверяет, что пользователь является администратором (декодированный токен доступа содержит роль пользователя). Если запрос отправлен администратором, управление передается сервису `removeUser`. Тело запроса должно содержать имя или email удаляемого пользователя. Если пользователь существует, он удаляется.


## Зачем нужно два токена?
Это не совсем очевидный момент, чтобы понять зачем нужно два токена, нужно рассмотреть логику авторизации более общими мазками.
Схема с двумя токенами работает следующим образом:
 - Пользователь логинится в приложении, передавая логин и пароль на сервер. Они не сохраняются на устройстве, а сервер возвращает два токена и время их жизни.
 - Приложение сохраняет токены и использует access token для последующих запросов.
 - Когда время жизни access token подходит к концу (приложение может само проверять время жизни, или дождаться пока во время очередного использования сервер ответит «ой, всё»), приложение использует refresh token, чтобы обновить оба токена и продолжить использовать новый access token

__Но всё-таки зачем два?__

Рассмотрим случаи атаки на приложение.

 - Случай 1: Злоумышленник узнал оба токена Алисы и не воспользовался refresh token. В этом случае хакер получит доступ к сервису на время жизни access token. Как только оно истечет и приложение, которым пользуется Алиса, воспользуется refresh token, сервер вернет новую пару токенов, а те, что узнал злоумышленник, превратятся в тыкву.

 - Случай 2: Злоумышленник узнал оба токена Алисы и воспользовался refresh. В этом случае оба токена Алисы превращаются в тыкву, приложение предлагает ей авторизоваться логином и паролем, сервер возвращает новую пару токенов, а те, что узнал хакер аннулируются (тут есть нюанс с device id, может вернуть ту же пару что и у хакера. В таком случае следующее использование refresh токена разлогинит злоумышленника).

Таким образом, схема с refresh + access токенами на самом деле нужна чтобы ограничить время, на которое атакующий может получить доступ к сервису. По сравнению с одним токеном, которым злоумышленник может пользоваться неделями и никто об этом не узнает.
