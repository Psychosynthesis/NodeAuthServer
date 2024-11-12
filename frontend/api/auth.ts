import { requestWrapper } from './fetch';

export const updateToken = () => {
	// Токен обновляется по проставленной ранее HTTPOnly куке, передавать ничего не нужно
	const token = requestWrapper({ url: 'api/auth/updateToken', method: 'POST', })
	return token;
}

export const login = ({
  username, pass
}) => {
	const token = requestWrapper({ url: 'api/auth/login', method: 'POST', body: { username, pass } })
	return token;
}

export const register = ({
  username, mail, pass
}) => {
	const token = requestWrapper({ url: 'api/auth/register', method: 'POST', body: { username, mail, pass } })
	return token;
}

export const getUser = (token: string) => {
	const user = requestWrapper({ url: 'api/auth/getUser', method: 'GET', headers: { 'X-csrf-token': token } })
	return user;
}
