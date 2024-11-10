// retryWrites указывает драйверам MongoDB автоматически повторять определенные операции записи один раз,
// если они сталкиваются с сетевыми ошибками или если они не могут найти работоспособный первичный узел в наборах реплик или сегментированном кластере
// Чтобы явно указать в какой БД сохранены данные аутентификации следует добавить параметр ?authSource=DBNAME
export const MONGODB_URI = 'mongodb://USER:PASS@SERVER:PORT/DBNAME&retryWrites=true&serverSelectionTimeoutMS=10000';

export const ACCESS_TOKEN_SECRET = 'access_token_secret'
export const ALLOWED_ORIGIN = 'http://localhost:5173' // Не забыть поменять для разработки
export const SENTRY_DSN = 'sentry_dsn'
