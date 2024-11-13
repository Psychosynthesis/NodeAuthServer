import { requestWrapper } from './fetch';

export const login = ({
  username, pass
}) => {
	const token = requestWrapper({ url: 'api/auth/login', method: 'POST', body: { username, pass } })
	return token;
}

export const logout = (token: string) => {
	const success = requestWrapper({ url: 'api/auth/logout', method: 'GET', headers: { 'X-csrf-token': token } })
	return success;
}

export const register = ({
  username, mail, pass
}) => {
	const token = requestWrapper({ url: 'api/auth/register', method: 'POST', body: { username, mail, pass } })
	return token;
}

export const updateToken = () => {
	// Токен обновляется по проставленной ранее HTTPOnly куке, передавать ничего не нужно
	const token = requestWrapper({ url: 'api/auth/updateToken', method: 'POST', })
	return token;
}

export const getUser = (token: string) => {
	const user = requestWrapper({ url: 'api/auth/getUser', method: 'GET', headers: { 'X-csrf-token': token } })
	return user;
}
