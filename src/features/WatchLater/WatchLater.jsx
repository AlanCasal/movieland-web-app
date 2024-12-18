import { useSelector } from 'react-redux';
import SelectedMoviesList from '../../components/SelectedMoviesList';
import watchLaterSlice from '../../store/slices/watchLaterSlice';

export const WATCH_LATER_TITLE = 'Watch Later List';
export const CLEAR_ALL_WATCH_LATER_MESSAGE = 'Empty list';
export const EMPTY_WATCH_LATER_MESSAGE =
	'You have no movies saved to watch later.';
export const ICON_CLASS = 'bi bi-heart';

const WatchLater = () => {
	const { watchLaterMovies } = useSelector(state => state.watchLater);
	const { clearAllWatchLater } = watchLaterSlice.actions;

	return (
		<SelectedMoviesList
			moviesList={watchLaterMovies}
			clearMovies={clearAllWatchLater}
			title={WATCH_LATER_TITLE}
			clearMoviesMessage={CLEAR_ALL_WATCH_LATER_MESSAGE}
			emptyMessage={EMPTY_WATCH_LATER_MESSAGE}
			iconClass={ICON_CLASS}
		/>
	);
};

export default WatchLater;
