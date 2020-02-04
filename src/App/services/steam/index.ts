import createSocket from 'socket.io-client';

const socket = createSocket(process.env.BACKEND_WS_HOST);

export interface IAppInfo {
	id: number;
	name: string;
}

export interface IMessage {
	event: string;
	done: boolean;
	game?: IAppInfo;
}

export interface IError {
	message: string;
}

export function onMessage(listener: (message: IMessage) => void) {

	socket.on('commonMultiplayerGames', listener);

	return () => socket.off('commonMultiplayerGames', listener);
}

export function onException(listener: (error: IError) => void) {

	socket.on('exception', listener);

	return () => socket.off('exception', listener);
}

export function searchCommonGames(links: string[]) {
	socket.emit('commonMultiplayerGames', {
		links
	});
}
