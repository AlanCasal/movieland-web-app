import { useSelector } from 'react-redux';
import SelectedMoviesList from '../../components/SelectedMoviesList';
import starredSlice from '../../store/slices/starredSlice';

export const EMPTY_STARRED_MESSAGE = 'There are no starred movies.';
export const CLEAR_ALL_STARRED_MESSAGE = 'Remove all starred';
export const STARRED_TITLE = 'Starred movies';
export const ICON_CLASS = 'bi bi-star';

const Starred = () => {
	const { starredMovies } = useSelector(state => state.starred);
	const { clearAllStarred } = starredSlice.actions;

	return (
		<SelectedMoviesList
			moviesList={starredMovies}
			clearMovies={clearAllStarred}
			emptyMessage={EMPTY_STARRED_MESSAGE}
			clearMoviesMessage={CLEAR_ALL_STARRED_MESSAGE}
			title={STARRED_TITLE}
			iconClass={ICON_CLASS}
		/>
	);
};

export default Starred;
