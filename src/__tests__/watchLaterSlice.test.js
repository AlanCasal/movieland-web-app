import { initialWatchLaterState } from '../store/initialState';
import watchLaterSlice from '../store/slices/watchLaterSlice';
import { moviesMock } from './movies.mocks';

describe('watchLaterSlice', () => {
	let initialState;

	beforeEach(() => {
		initialState = { ...initialWatchLaterState };
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should set initial state', () => {
		const action = { type: '' };
		const result = watchLaterSlice.reducer(initialState, action);
		expect(result).toEqual(initialWatchLaterState);
	});

	it('should add movie to watch later', () => {
		const action = watchLaterSlice.actions.addToWatchLater(moviesMock[0]);
		const result = watchLaterSlice.reducer(initialState, action);
		expect(result.watchLaterMovies[0]).toBe(moviesMock[0]);
	});

	it('should remove movie from watch later', () => {
		const state = { ...initialState, watchLaterMovies: moviesMock };
		const action = watchLaterSlice.actions.removeFromWatchLater(moviesMock[0]);
		const result = watchLaterSlice.reducer(state, action);
		expect(result.watchLaterMovies[0]).toBe(moviesMock[1]);
	});

	it('should remove all movies', () => {
		const state = { ...initialState, watchLaterMovies: moviesMock };
		const action = watchLaterSlice.actions.clearAllWatchLater();
		const result = watchLaterSlice.reducer(state, action);

		expect(result.watchLaterMovies).toHaveLength(0);
		expect(result.watchLaterMovies).toEqual([]);
	});

	it('should not add duplicate movies to watch later', () => {
		const state = { watchLaterMovies: [moviesMock[0]] };
		const action = watchLaterSlice.actions.addToWatchLater(moviesMock[0]);
		const result = watchLaterSlice.reducer(state, action);

		expect(result.watchLaterMovies).toHaveLength(1);
		expect(result.watchLaterMovies[0]).toBe(moviesMock[0]);
	});

	it('should show alert when trying to remove non-existent movie', () => {
		const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
		const nonExistentMovie = { id: 999, title: 'Non-existent Movie' };

		const action =
			watchLaterSlice.actions.removeFromWatchLater(nonExistentMovie);
		const result = watchLaterSlice.reducer(initialState, action);

		expect(alertMock).toHaveBeenCalledWith(
			`Attempted to remove movie ${nonExistentMovie.title} that wasn't in the list`
		);
		expect(result.watchLaterMovies).toEqual([]);

		alertMock.mockRestore();
	});

	it('should maintain correct order when adding multiple movies', () => {
		let state = { watchLaterMovies: [] };
		state = watchLaterSlice.reducer(
			state,
			watchLaterSlice.actions.addToWatchLater(moviesMock[0])
		);
		state = watchLaterSlice.reducer(
			state,
			watchLaterSlice.actions.addToWatchLater(moviesMock[1])
		);

		expect(state.watchLaterMovies).toHaveLength(2);
		expect(state.watchLaterMovies[0]).toBe(moviesMock[1]);
		expect(state.watchLaterMovies[1]).toBe(moviesMock[0]);
	});

	it('should maintain the correct order when removing a movie', () => {
		const state = { watchLaterMovies: [...moviesMock] };
		const movieToRemove = moviesMock[1];

		const action = watchLaterSlice.actions.removeFromWatchLater(movieToRemove);
		const result = watchLaterSlice.reducer(state, action);

		expect(result.watchLaterMovies).toHaveLength(2);
		expect(result.watchLaterMovies[0]).toBe(moviesMock[0]);
		expect(result.watchLaterMovies[1]).toBe(moviesMock[2]);
	});
});
