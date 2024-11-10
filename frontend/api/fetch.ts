import { VERIFICATION_CODE, SERVER_PORT } from '../../commons/config.json';
import type { AppRequestWrapper } from '@Commn/types';

//@ts-ignore
const devPrefix = import.meta.env.DEV ?
	'http://127.0.0.1:'+SERVER_PORT+'/' :
	'http://127.0.0.1:'+SERVER_PORT+'/';

const defaultHeaders = {
	"Content-Type": "application/json",
	"x-verification-code": VERIFICATION_CODE
};

export const requestWrapper = ({ url, method, headers, body }: AppRequestWrapper) => {
  return window.fetch(devPrefix+url, {
      method: method,
      headers: { ...defaultHeaders, ...headers },
			credentials: "include",
      body: JSON.stringify(body)
  }).then(response => {
    if (!response.ok) { return Promise.reject(response); }
		return response.json();
  }).then(data => {
		return { error: false, data: data };
  }).catch(error => {
    if (typeof error.json === "function") {
			//@ts-ignore
			if (__DETAILED_ERR__) console.error("API error full info: ", error);
      return error.json().then((jsonError: any) => {
        console.error("Json error from API: ", jsonError);
				return jsonError;
      }).catch(() => {
        console.error("Generic error from API: ", error.statusText);
				return error;
      });
    } else {
      console.error("Fetch error: ", error);
    }
		return error;
  });
}
