/* eslint-disable consistent-return */
/* eslint-disable import/no-named-as-default-member */
/* eslint-disable no-param-reassign */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { movieApi } from '../../services/movieApi';
import axios from 'axios';
import { initialMoviesState, fetchStatus } from '../initialState';

export const fetchMovies = createAsyncThunk(
	'fetch-movies',
	async (params, { rejectWithValue }) => {
		try {
			const response = await movieApi.fetchMovies(params);

			return response;
		} catch (error) {
			if (axios.isCancel(error)) return;
			return rejectWithValue(error.message);
		}
	}
);

const moviesSlice = createSlice({
	name: 'movies',
	initialState: initialMoviesState,
	reducers: {
		resetMovies: state => {
			state.movies = initialMoviesState.movies;
			state.hasMoreMovies = initialMoviesState.hasMoreMovies;
			state.fetchStatus = initialMoviesState.fetchStatus;
			state.page = initialMoviesState.page;
			state.totalPages = initialMoviesState.totalPages;
		},
	},
	extraReducers: builder => {
		builder
			.addCase(fetchMovies.fulfilled, (state, { payload }) => {
				state.movies =
					payload.page > 1
						? [...state.movies, ...payload.results]
						: payload.results;

				state.page = payload.page;
				state.totalPages = payload.total_pages;
				state.hasMoreMovies = payload.page < payload.total_pages;
				state.fetchStatus = fetchStatus.success;
			})
			.addCase(fetchMovies.pending, state => {
				state.fetchStatus = fetchStatus.loading;
			})
			.addCase(fetchMovies.rejected, (state, action) => {
				state.fetchStatus = fetchStatus.error;
				alert(action.payload);
			});
	},
});

export const { resetMovies } = moviesSlice.actions;
export default moviesSlice;
