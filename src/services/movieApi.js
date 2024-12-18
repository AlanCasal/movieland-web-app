/* eslint-disable import/no-named-as-default-member */
/* eslint-disable consistent-return */
import axios from 'axios';
import { ENDPOINT_MOVIE } from '../utils/constants';

let cancelTokenSource;

export const movieApi = {
	fetchMovies: async ({ apiUrl, params }) => {
		if (cancelTokenSource)
			cancelTokenSource.cancel('Operation cancelled due to new request.');

		cancelTokenSource = axios.CancelToken.source();

		const response = await axios({
			method: 'GET',
			url: apiUrl,
			params: { ...params },
			cancelToken: cancelTokenSource.token,
		});
		return response.data;
	},
	fetchMovieTrailer: async movieId => {
		const response = await axios({
			method: 'GET',
			url: ENDPOINT_MOVIE(movieId),
		});
		return response.data;
	},
};
