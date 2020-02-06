import Axios, {
	CancelTokenSource,
	CancelToken as CancelTokenType
} from 'axios';
import qs from 'qs';

export {
	Axios as default,
	qs
};

const {
	CancelToken: CancelTokenStatic
} = Axios;

export type CancelToken = CancelTokenType;

export const CancelToken = CancelTokenStatic;

Object.assign(Axios.defaults, {
	responseType: 'json'
});

const cancelTokens = new Map<any, CancelTokenSource>();

export function getCancelToken(key: any) {

	if (cancelTokens.has(key)) {
		cancelTokens.get(key).cancel();
	}

	const source = CancelToken.source();

	cancelTokens.set(key, source);

	return source.token;
}

export function isCancelToken(token: any) {
	return token && token.__CANCEL__;
}
