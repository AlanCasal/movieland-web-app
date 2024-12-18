import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './utils';
import App, { NOT_FOUND_MESSAGE } from '../App';
import { EMPTY_STARRED_MESSAGE } from '../features/Starred/Starred';
import { EMPTY_WATCH_LATER_MESSAGE } from '../features/WatchLater/WatchLater';

describe('App', () => {
	afterEach(() => {
		window.history.pushState({}, '', '/');
	});

	it('renders basic app structure', () => {
		renderWithProviders(<App />);
		expect(screen.getByRole('banner')).toBeInTheDocument();
		expect(screen.getByRole('main')).toBeInTheDocument();
	});

	it('navigates to different routes', async () => {
		renderWithProviders(<App />);
		const user = userEvent.setup();

		expect(screen.getByTestId('movies')).toBeInTheDocument();

		await user.click(screen.getByTestId('nav-starred'));
		expect(screen.getByTestId('starred')).toBeInTheDocument();
		expect(screen.getByText(EMPTY_STARRED_MESSAGE)).toBeInTheDocument();

		await user.click(screen.getByRole('link', { name: /watch later/i }));
		expect(screen.getByText(EMPTY_WATCH_LATER_MESSAGE)).toBeInTheDocument();
	});

	it('shows not found page for invalid routes', () => {
		window.history.pushState({}, '', '/invalid-route');
		renderWithProviders(<App />);
		expect(
			screen.getByRole('heading', { name: NOT_FOUND_MESSAGE })
		).toBeInTheDocument();
	});
});
