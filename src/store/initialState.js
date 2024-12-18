export const fetchStatus = {
	initial: '',
	loading: 'loading',
	success: 'success',
	error: 'error',
};

export const initialMoviesState = {
	movies: [],
	hasMoreMovies: false,
	fetchStatus: fetchStatus.initial,
	page: 1,
	totalPages: 0,
};

export const initialStarredState = {
	starredMovies: [],
};

export const initialWatchLaterState = {
	watchLaterMovies: [],
};

export const initialState = {
	movies: initialMoviesState,
	starred: initialStarredState,
	watchLater: initialWatchLaterState,
};
