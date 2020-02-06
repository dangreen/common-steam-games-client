import Axios, {
	qs
} from '~/services/axios';

export default Axios.create({
	baseURL:          `${process.env.BACKEND_HOST}/api/steam`,
	paramsSerializer: params => qs.stringify(params, { indices: false })
});
