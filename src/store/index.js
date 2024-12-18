import { configureStore } from '@reduxjs/toolkit';
import moviesSlice from './slices/moviesSlice';
import starredSlice from './slices/starredSlice';
import watchLaterSlice from './slices/watchLaterSlice';

const store = configureStore({
	reducer: {
		movies: moviesSlice.reducer,
		starred: starredSlice.reducer,
		watchLater: watchLaterSlice.reducer,
	},
});

export default store;
