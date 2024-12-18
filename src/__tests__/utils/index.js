import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/dist/query';
import moviesSlice from '../../store/slices/moviesSlice';
import starredSlice from '../../store/slices/starredSlice';
import watchLaterSlice from '../../store/slices/watchLaterSlice';

window.scrollTo = jest.fn();

export function renderWithProviders(
	ui,
	{
		preloadedState = {},
		store = configureStore({
			reducer: {
				movies: moviesSlice.reducer,
				starred: starredSlice.reducer,
				watchLater: watchLaterSlice.reducer,
			},
			preloadedState,
		}),
		...renderOptions
	} = {}
) {
	setupListeners(store.dispatch);

	function Wrapper({ children }) {
		return (
			<Provider store={store}>
				<BrowserRouter>{children}</BrowserRouter>
			</Provider>
		);
	}

	return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
