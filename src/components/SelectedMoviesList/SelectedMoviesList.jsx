import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Movie from '../Movie';
import './styles.scss';

const SelectedMoviesList = ({
	moviesList,
	viewTrailer,
	clearMovies,
	title = 'Selected Movies',
	emptyMessage = 'There are no saved movies.',
	clearMoviesMessage = 'Remove All',
	iconClass = '',
}) => {
	const dispatch = useDispatch();

	const handleClearMovies = () => {
		dispatch(clearMovies());
	};

	return (
		<div className="starred" data-testid="starred">
			{moviesList.length > 0 ? (
				<div data-testid="starred-movies" className="starred-movies">
					<h6>{title}</h6>
					<div className="row">
						{moviesList.map(movie => (
							<Movie movie={movie} key={movie.id} viewTrailer={viewTrailer} />
						))}
					</div>

					<div className="button-wrapper text-center">
						<button className="btn btn-primary" onClick={handleClearMovies}>
							{clearMoviesMessage}
						</button>
					</div>
				</div>
			) : (
				<div className="text-center empty-cart">
					{iconClass && <i className={iconClass} />}
					<p>{emptyMessage}</p>
					<p>
						Go to <Link to="/">Home</Link>
					</p>
				</div>
			)}
		</div>
	);
};

export default SelectedMoviesList;
