/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { initialStarredState } from '../initialState';

const starredSlice = createSlice({
	name: 'starred',
	initialState: initialStarredState,
	reducers: {
		starMovie: (state, action) => {
			const isDuplicate = state.starredMovies.some(
				movie => movie.id === action.payload.id
			);
			if (!isDuplicate)
				state.starredMovies = [action.payload, ...state.starredMovies];
		},
		unstarMovie: (state, { payload }) => {
			const indexOfId = state.starredMovies.findIndex(
				movie => movie.id === payload.id
			);

			if (indexOfId !== -1) state.starredMovies.splice(indexOfId, 1);
			else {
				alert(
					`Attempted to unstar movie ${payload.title} that wasn't in the list`
				);
			}
		},
		clearAllStarred: state => {
			state.starredMovies = initialStarredState.starredMovies;
		},
	},
});

export default starredSlice;
