/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { initialWatchLaterState } from '../initialState';

const watchLaterSlice = createSlice({
	name: 'watch-later',
	initialState: initialWatchLaterState,
	reducers: {
		addToWatchLater: (state, action) => {
			const isDuplicate = state.watchLaterMovies.some(
				movie => movie.id === action.payload.id
			);
			if (!isDuplicate)
				state.watchLaterMovies = [action.payload, ...state.watchLaterMovies];
		},
		removeFromWatchLater: (state, { payload }) => {
			const indexOfId = state.watchLaterMovies.findIndex(
				movie => movie.id === payload.id
			);
			if (indexOfId !== -1) state.watchLaterMovies.splice(indexOfId, 1);
			else {
				alert(
					`Attempted to remove movie ${payload.title} that wasn't in the list`
				);
			}
		},
		clearAllWatchLater: state => {
			state.watchLaterMovies = [];
		},
	},
});

export default watchLaterSlice;
