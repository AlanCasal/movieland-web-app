import moviesSlice, {
	fetchMovies,
	resetMovies,
} from '../store/slices/moviesSlice';
import { moviesMock } from './movies.mocks';
import { fetchStatus, initialMoviesState } from '../store/initialState';

describe('MoviesSlice', () => {
	describe('fetchMovies thunk', () => {
		it('should set fetchStatus to loading while action is pending', () => {
			const initialState = { ...initialMoviesState };
			const pendingAction = { type: fetchMovies.pending.type };

			const state = moviesSlice.reducer(initialState, pendingAction);

			expect(state.fetchStatus).toBe(fetchStatus.loading);
			expect(state.movies).toEqual([]);
		});

		it('should set fetchStatus to success and update state with movies data when fetch succeeds', async () => {
			const mockPayload = {
				results: moviesMock,
				page: 1,
				total_pages: 5,
			};
			const fulfilledAction = {
				type: fetchMovies.fulfilled.type,
				payload: mockPayload,
			};

			const state = moviesSlice.reducer(initialMoviesState, fulfilledAction);

			expect(state.movies).toEqual(mockPayload.results);
			expect(state.totalPages).toBe(mockPayload.total_pages);
			expect(state.page).toBe(mockPayload.page);
			expect(state.hasMoreMovies).toBe(true);
			expect(state.fetchStatus).toBe('success');
		});

		it('should set fetchStatus to error when action is rejected', () => {
			const errorMessage = 'Failed to fetch movies';
			const rejectedAction = {
				type: fetchMovies.rejected.type,
				payload: errorMessage,
			};

			const state = moviesSlice.reducer(initialMoviesState, rejectedAction);

			expect(state.fetchStatus).toBe('error');
			expect(state.movies).toEqual([]);
		});

		it('should set loading state while fetching movies', () => {
			const action = { type: fetchMovies.pending.type };
			const state = moviesSlice.reducer(initialMoviesState, action);

			expect(state.fetchStatus).toBe('loading');
		});

		it('should update state with movies data when fetch succeeds', () => {
			const payload = {
				results: moviesMock,
				page: 1,
				total_pages: 10,
			};
			const action = {
				type: fetchMovies.fulfilled.type,
				payload,
			};
			const state = moviesSlice.reducer(initialMoviesState, action);

			expect(state.movies).toEqual(payload.results);
			expect(state.page).toBe(payload.page);
			expect(state.totalPages).toBe(payload.total_pages);
			expect(state.hasMoreMovies).toBe(true);
			expect(state.fetchStatus).toBe('success');
		});

		it('should append movies when loading subsequent pages', () => {
			const existingState = {
				...initialMoviesState,
				movies: [{ id: 1, title: 'Existing Movie' }],
			};
			const payload = {
				results: moviesMock,
				page: 2,
				total_pages: 10,
			};
			const action = {
				type: fetchMovies.fulfilled.type,
				payload,
			};
			const state = moviesSlice.reducer(existingState, action);

			expect(state.movies).toEqual([
				...existingState.movies,
				...payload.results,
			]);
			expect(state.page).toBe(2);
		});

		it('should set error state when fetch fails', () => {
			const action = {
				type: fetchMovies.rejected.type,
				payload: 'Error message',
			};
			const state = moviesSlice.reducer(initialMoviesState, action);

			expect(state.fetchStatus).toBe('error');
		});

		it('should set hasMoreMovies to false when on last page', () => {
			const mockPayload = {
				results: moviesMock,
				page: 5,
				total_pages: 5,
			};
			const fulfilledAction = {
				type: fetchMovies.fulfilled.type,
				payload: mockPayload,
			};

			const state = moviesSlice.reducer(initialMoviesState, fulfilledAction);

			expect(state.hasMoreMovies).toBe(false);
			expect(state.page).toBe(mockPayload.page);
			expect(state.totalPages).toBe(mockPayload.total_pages);
		});
	});

	describe('resetMovies reducer', () => {
		it('should reset state to initial values', () => {
			const existingState = {
				movies: moviesMock,
				hasMoreMovies: true,
				fetchStatus: 'success',
				page: 2,
				totalPages: 10,
			};
			const action = resetMovies();
			const state = moviesSlice.reducer(existingState, action);

			expect(state).toEqual(initialMoviesState);
		});
	});
});
