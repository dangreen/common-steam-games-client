import {
	CancelToken
} from '~/services/axios';
import axios from './client';

export interface IAppInfo {
	id: number;
	name: string;
}

export async function fetchCommonGames(links: string[], cancelToken?: CancelToken) {

	try {

		const {
			data
		} = await axios.post<IAppInfo[]>('/common-multiplayer-games', {
			links
		}, {
			cancelToken
		});

		return data;

	} catch (err) {

		if (err.response) {

			const {
				message
			} = err.response.data;

			throw new Error(message);
		}

		throw err;
	}
}
