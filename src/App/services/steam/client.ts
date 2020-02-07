import Axios, {
	qs
} from '~/services/axios';

export default Axios.create({
	baseURL:          `${process.env.BACKEND_HOST}/api/steam`,
	paramsSerializer: params => qs.stringify(params, { indices: false })
});

export function getErrorMessage(error: any): string {

	if (typeof error.message === 'string') {
		return error.message;
	}

	if (Array.isArray(error.message)) {

		const [
			firstMessage
		] = error.message;

		if (typeof firstMessage.constraints === 'object') {

			const {
				constraints
			} = firstMessage;
			const message = constraints[Object.keys(constraints)[0]];

			return message;
		}

	}

	return 'Unknown error';
}
