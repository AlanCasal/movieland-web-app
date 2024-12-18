import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './utils';
import App from '../App';
import {
	CLEAR_ALL_WATCH_LATER_MESSAGE,
	EMPTY_WATCH_LATER_MESSAGE,
} from '../features/WatchLater/WatchLater';
import { moviesMock } from './movies.mocks';

describe('Watch Later Feature', () => {
	describe('Empty State', () => {
		it('should show empty state message and go home link', async () => {
			renderWithProviders(<App />);
			await userEvent.click(screen.getByText('watch later'));

			expect(screen.getByText(EMPTY_WATCH_LATER_MESSAGE)).toBeInTheDocument();
			expect(screen.getByText('Home')).toBeInTheDocument();
		});

		it('should not show clear all button when list is empty', async () => {
			renderWithProviders(<App />);
			await userEvent.click(screen.getByText('watch later'));

			expect(
				screen.queryByText(CLEAR_ALL_WATCH_LATER_MESSAGE)
			).not.toBeInTheDocument();
		});
	});

	describe('Single Movie State', () => {
		it('should display the movie and clear all button', async () => {
			renderWithProviders(<App />, {
				preloadedState: {
					watchLater: { watchLaterMovies: [moviesMock[0]] },
				},
			});

			expect(screen.getAllByText(moviesMock[0].title)[0]).toBeInTheDocument();
			expect(
				screen.getByText(CLEAR_ALL_WATCH_LATER_MESSAGE)
			).toBeInTheDocument();
			expect(screen.getByTestId('remove-watch-later')).toBeInTheDocument();
		});

		it('should remove movie and show empty state', async () => {
			renderWithProviders(<App />, {
				preloadedState: {
					watchLater: { watchLaterMovies: [moviesMock[0]] },
				},
			});

			await userEvent.click(screen.getByTestId('remove-watch-later'));

			expect(screen.getByText(EMPTY_WATCH_LATER_MESSAGE)).toBeInTheDocument();
			expect(screen.queryByText(moviesMock[0].title)).not.toBeInTheDocument();
		});
	});

	describe('Multiple Movies State', () => {
		it('should display all movies added to watch later', async () => {
			renderWithProviders(<App />, {
				preloadedState: {
					watchLater: { watchLaterMovies: moviesMock },
				},
			});

			moviesMock.forEach(movie => {
				expect(screen.getAllByText(movie.title)[0]).toBeInTheDocument();
			});
		});

		it('should clear all movies when clicking Empty list button', async () => {
			renderWithProviders(<App />, {
				preloadedState: {
					watchLater: { watchLaterMovies: moviesMock },
				},
			});

			await userEvent.click(screen.getByText(CLEAR_ALL_WATCH_LATER_MESSAGE));

			moviesMock.forEach(movie => {
				expect(screen.queryByText(movie.title)).not.toBeInTheDocument();
			});

			expect(screen.getByText(EMPTY_WATCH_LATER_MESSAGE)).toBeInTheDocument();
		});
	});
});
