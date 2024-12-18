import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import placeholder from '../../assets/not-found-500X750.jpeg';
import starredSlice from '../../store/slices/starredSlice';
import watchLaterSlice from '../../store/slices/watchLaterSlice';
import './styles.scss';
import Popup from '../Popup';
import YoutubePlayer from '../YoutubePlayer/YoutubePlayer';
import { movieApi } from '../../services/movieApi';

const Movie = ({ movie, lastMovieRef }) => {
	const {
		starred: { starredMovies },
		watchLater: { watchLaterMovies },
	} = useSelector(state => state);
	const { starMovie, unstarMovie } = starredSlice.actions;
	const { addToWatchLater, removeFromWatchLater } = watchLaterSlice.actions;
	const [videoKey, setVideoKey] = useState(null);
	const [isOpen, setOpen] = useState(false);

	const dispatch = useDispatch();

	const getMovie = async () => {
		setVideoKey(null);

		const videoData = await movieApi.fetchMovieTrailer(movie.id);

		if (videoData.videos && videoData.videos.results.length) {
			const trailer = videoData.videos.results.find(
				vid => vid.type === 'Trailer'
			);
			const newVideoKey = trailer
				? trailer.key
				: videoData.videos.results[0].key;

			setVideoKey(newVideoKey);
			setOpen(true);
		}
	};

	const viewTrailer = () => {
		if (videoKey) return;

		getMovie();
	};

	const handleCloseMovie = e => {
		e?.stopPropagation();
		const openedMovie = document.querySelector('.card.opened');
		if (openedMovie) openedMovie.classList.remove('opened');
	};

	const handleOpenMovie = () => {
		handleCloseMovie();

		const movieElement = document.getElementById(movie.id);
		movieElement.querySelector('.card').classList.add('opened');
	};

	const handleCloseModal = () => {
		setVideoKey(null);
		setOpen(false);
	};

	const handleStarMovie = () => {
		dispatch(
			starMovie({
				id: movie.id,
				overview: movie.overview,
				release_date: movie.release_date?.substring(0, 4),
				poster_path: movie.poster_path,
				title: movie.title,
			})
		);
	};

	const handleUnstarMovie = () => {
		dispatch(unstarMovie(movie));
	};

	const handleAddToWatchLater = () => {
		dispatch(
			addToWatchLater({
				id: movie.id,
				overview: movie.overview,
				release_date: movie.release_date?.substring(0, 4),
				poster_path: movie.poster_path,
				title: movie.title,
			})
		);
	};

	const handleRemoveFromWatchLater = () => {
		dispatch(removeFromWatchLater(movie));
	};

	useEffect(() => {
		const handleClickOutside = e => {
			if (e.target.closest('.card')) return;

			handleCloseMovie();
		};

		document.addEventListener('click', handleClickOutside);
		return () => document.removeEventListener('click', handleClickOutside);
	}, []);

	return (
		<>
			<Popup isOpen={isOpen} handleCloseModal={handleCloseModal}>
				<YoutubePlayer videoKey={videoKey} />
			</Popup>
			<div
				id={movie.id}
				className="wrapper col-3 col-sm-4 col-md-3 col-lg-3 col-xl-2"
				ref={lastMovieRef}
			>
				<div className="card" onClick={handleOpenMovie}>
					<div className="card-body text-center">
						<div className="overlay" />
						<div className="info_panel">
							<div className="overview">{movie.overview}</div>
							<div className="year">{movie.release_date?.substring(0, 4)}</div>
							{!starredMovies
								.map(movieItem => movieItem.id)
								.includes(movie.id) ? (
								<span
									className="btn-star"
									data-testid="starred-link"
									onClick={handleStarMovie}
								>
									<i className="bi bi-star" />
								</span>
							) : (
								<span
									className="btn-star"
									data-testid="unstar-link"
									onClick={handleUnstarMovie}
								>
									<i className="bi bi-star-fill" data-testid="star-fill" />
								</span>
							)}
							{!watchLaterMovies
								.map(movieItem => movieItem.id)
								.includes(movie.id) ? (
								<button
									type="button"
									data-testid="watch-later"
									className="btn btn-light btn-watch-later"
									onClick={handleAddToWatchLater}
								>
									Watch Later
								</button>
							) : (
								<button
									type="button"
									data-testid="remove-watch-later"
									className="btn btn-light btn-watch-later blue"
									onClick={handleRemoveFromWatchLater}
								>
									<i className="bi bi-check"></i>
								</button>
							)}
							<button
								type="button"
								className="btn btn-dark"
								onClick={viewTrailer}
							>
								View Trailer
							</button>
						</div>
						<img
							className="center-block"
							src={
								movie.poster_path
									? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
									: placeholder
							}
							alt="Movie poster"
						/>
					</div>
					<h6 className="title mobile-card">{movie.title}</h6>
					<h6 className="title">{movie.title}</h6>
					<button
						type="button"
						className="close"
						onClick={handleCloseMovie}
						aria-label="Close"
					>
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
			</div>
		</>
	);
};

export default Movie;
