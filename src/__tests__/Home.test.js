import React from 'react';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import App from '../App';
import { renderWithProviders } from './utils';
import { moviesMock } from './movies.mocks';
import { ENDPOINT_DISCOVER, ENDPOINT_SEARCH } from '../utils/constants';

/* eslint-disable class-methods-use-this */
global.IntersectionObserver = class IntersectionObserver {
	constructor(callback) {
		this.callback = callback;
	}

	observe() {
		this.callback([{ isIntersecting: true }]);
	}

	unobserve() {}

	disconnect() {}
};

jest.mock('../services/movieApi', () => ({
	movieApi: {
		fetchMovies: jest.fn(),
		fetchMovieTrailer: jest.fn(),
	},
}));

const { movieApi } = require('../services/movieApi');

describe('Home Component', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('sets loading state when search params change', async () => {
		movieApi.fetchMovies.mockResolvedValue({
			results: moviesMock,
			page: 1,
			total_pages: 2,
		});

		renderWithProviders(<App />);

		await waitFor(() => {
			expect(screen.getAllByText(moviesMock[0].title)[0]).toBeInTheDocument();
		});

		// Change search params
		window.history.pushState({}, '', '?search=new');

		// Should show loading state
		expect(screen.getByText(/Loading more movies.../i)).toBeInTheDocument();
	});

	it('debounces movie fetch calls', () => {
		jest.useFakeTimers();

		const mockMovies = {
			results: moviesMock,
			page: 1,
			total_pages: 2,
		};
		movieApi.fetchMovies.mockResolvedValue(mockMovies);

		renderWithProviders(<App />);

		const searchInput = screen.getByTestId('search-movies');
		fireEvent.change(searchInput, { target: { value: 'test1' } });
		fireEvent.change(searchInput, { target: { value: 'test2' } });
		fireEvent.change(searchInput, { target: { value: 'test3' } });

		jest.advanceTimersByTime(300);

		expect(movieApi.fetchMovies).toHaveBeenCalledTimes(1);
		expect(movieApi.fetchMovies).toHaveBeenLastCalledWith({
			apiUrl: ENDPOINT_SEARCH,
			params: { query: 'test3', page: 1 },
		});

		jest.useRealTimers();
	});

	it('scrolls to top on mount', () => {
		const scrollToSpy = jest.spyOn(window, 'scrollTo');

		renderWithProviders(<App />);

		expect(scrollToSpy).toHaveBeenCalledWith(0, 0);

		scrollToSpy.mockRestore();
	});

	it('cancels debounced fetch on unmount', () => {
		jest.useFakeTimers();

		const mockMovies = {
			results: moviesMock,
			page: 1,
			total_pages: 1,
		};
		movieApi.fetchMovies.mockResolvedValue(mockMovies);

		const { unmount } = renderWithProviders(<App />);

		const searchInput = screen.getByTestId('search-movies');
		fireEvent.change(searchInput, { target: { value: 'test' } });

		unmount();

		jest.advanceTimersByTime(300);

		expect(movieApi.fetchMovies).toHaveBeenCalledTimes(0);

		jest.useRealTimers();
	});

	it('stops loading when no more results', async () => {
		const mockMoviesNoMore = {
			results: moviesMock,
			page: 1,
			total_pages: 1,
		};

		movieApi.fetchMovies.mockResolvedValue(mockMoviesNoMore);

		renderWithProviders(<App />);

		await waitFor(() => {
			expect(screen.getAllByText(moviesMock[0].title)[0]).toBeInTheDocument();
		});

		// eslint-disable-next-line testing-library/no-node-access
		const lastMovie = screen.getByTestId('movies').lastChild;
		const observer = new IntersectionObserver(
			entries => !entries[0].isIntersecting && entries[0].target === lastMovie
		);
		observer.observe(lastMovie);

		await waitFor(() => {
			expect(movieApi.fetchMovies).toHaveBeenCalledTimes(1);
		});
	});

	it('loads more results on scroll when more are available', async () => {
		jest.useFakeTimers();

		window.history.pushState({}, '', '/');

		const mockMoviesPage1 = {
			results: moviesMock.slice(0, 2),
			page: 1,
			total_pages: 2, // This makes hasMoreMovies true
		};

		const mockMoviesPage2 = {
			results: moviesMock.slice(2),
			page: 2,
			total_pages: 2,
		};

		movieApi.fetchMovies
			.mockResolvedValueOnce(mockMoviesPage1)
			.mockResolvedValueOnce(mockMoviesPage2);

		renderWithProviders(<App />);

		// Wait for initial load
		await waitFor(() => {
			expect(screen.getAllByText(moviesMock[0].title)[0]).toBeInTheDocument();
		});

		// Clear previous calls
		movieApi.fetchMovies.mockClear();

		// Get the last movie element and trigger intersection
		// eslint-disable-next-line testing-library/no-node-access
		const lastMovie = screen.getByTestId('movies').lastChild;
		const observer = new IntersectionObserver(
			entries => !entries[0].isIntersecting && entries[0].target === lastMovie
		);
		observer.observe(lastMovie);

		// Advance timers for debounce
		jest.advanceTimersByTime(300);

		// Verify second page was fetched and new content is displayed
		await waitFor(() => {
			expect(movieApi.fetchMovies).toHaveBeenCalledTimes(1);
		});

		await waitFor(() => {
			expect(movieApi.fetchMovies).toHaveBeenLastCalledWith({
				apiUrl: ENDPOINT_DISCOVER,
				params: { query: null, page: 2 },
			});
		});

		jest.useRealTimers();
	});
});
