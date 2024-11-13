import { VERIFICATION_CODE, SERVER_PORT } from '@Config';
import type { AppRequestWrapper } from '@Commn/types';

//@ts-ignore
const devPrefix = import.meta.env.DEV ?
	'http://127.0.0.1:'+SERVER_PORT+'/' :
	'http://127.0.0.1:'+SERVER_PORT+'/';

const buildHeaders = (addedHeaders) => {
	const myHeaders = new Headers();
	myHeaders.append('Content-Type', 'application/json');
	myHeaders.append("X-verification-code", VERIFICATION_CODE)
	if (addedHeaders) {
		Object.keys(addedHeaders).forEach(header => {
			myHeaders.append(header, addedHeaders[header]);
		})
	}
	return myHeaders;
}

export const requestWrapper = ({ url, method, headers, body }: AppRequestWrapper) => {
  return window.fetch(devPrefix+url, {
      method: method,
      headers: buildHeaders(headers),
			credentials: "include", // Чтобы передавалась кука с рефреш-токеном
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
