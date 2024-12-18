import { initialStarredState } from '../store/initialState';
import starredSlice from '../store/slices/starredSlice';
import { moviesMock } from './movies.mocks';

describe('starredSlice', () => {
	let initialState;

	beforeEach(() => {
		initialState = { ...initialStarredState };
		jest.restoreAllMocks();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should set an initial state', () => {
		const action = { type: '' };
		const result = starredSlice.reducer(initialState, action);
		expect(result).toEqual({ starredMovies: [] });
	});

	it('should add movie to starred', () => {
		const action = starredSlice.actions.starMovie(moviesMock[0]);
		const result = starredSlice.reducer(initialState, action);
		expect(result.starredMovies[0]).toBe(moviesMock[0]);
	});

	it('should remove movie from starred', () => {
		const state = { ...initialState, starredMovies: moviesMock };
		const action = starredSlice.actions.unstarMovie(moviesMock[0]);
		const result = starredSlice.reducer(state, action);
		expect(result.starredMovies[0]).toBe(moviesMock[1]);
	});

	it('should remove all movies', () => {
		const state = { ...initialState, starredMovies: moviesMock };
		const action = starredSlice.actions.clearAllStarred(state);
		const result = starredSlice.reducer(state, action);

		expect(result.starredMovies).toHaveLength(0);
		expect(result.starredMovies).toEqual([]);
	});

	it('should not add duplicate movies to starred', () => {
		const state = { starredMovies: [moviesMock[0]] };
		const action = starredSlice.actions.starMovie(moviesMock[0]);
		const result = starredSlice.reducer(state, action);

		expect(result.starredMovies).toHaveLength(1);
		expect(result.starredMovies[0]).toBe(moviesMock[0]);
	});

	it('should maintain correct order when starring multiple movies', () => {
		let state = initialState;
		state = starredSlice.reducer(
			state,
			starredSlice.actions.starMovie(moviesMock[0])
		);
		state = starredSlice.reducer(
			state,
			starredSlice.actions.starMovie(moviesMock[1])
		);
		expect(state.starredMovies).toHaveLength(2);
		expect(state.starredMovies[0]).toBe(moviesMock[1]);
		expect(state.starredMovies[1]).toBe(moviesMock[0]);
	});

	it('should show alert when trying to unstar non-existent movie', () => {
		const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
		const action = starredSlice.actions.unstarMovie(moviesMock[0]);
		starredSlice.reducer(initialState, action);
		expect(alertMock).toHaveBeenCalledWith(
			`Attempted to unstar movie ${moviesMock[0].title} that wasn't in the list`
		);
		alertMock.mockRestore();
	});

	it('should maintain the correct order when removing a movie', () => {
		const state = { starredMovies: [...moviesMock] };
		const movieToRemove = moviesMock[1];

		const action = starredSlice.actions.unstarMovie(movieToRemove);
		const result = starredSlice.reducer(state, action);

		expect(result.starredMovies).toHaveLength(2);
		expect(result.starredMovies[0]).toBe(moviesMock[0]);
		expect(result.starredMovies[1]).toBe(moviesMock[2]);
	});
});
