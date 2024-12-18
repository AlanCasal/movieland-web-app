import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Movie from '../../components/Movie';
import './styles.scss';
import { ENDPOINT_DISCOVER, ENDPOINT_SEARCH } from '../../utils/constants';
import { fetchMovies, resetMovies } from '../../store/slices/moviesSlice';
import { useSearchParams } from 'react-router-dom';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
// eslint-disable-next-line import/no-extraneous-dependencies
import debounce from 'lodash.debounce';

const DEBOUNCE_TIME = 300;

export default function Home() {
	const { movies, page, totalPages, fetchStatus, hasMoreMovies } = useSelector(
		state => state.movies
	);
	const dispatch = useDispatch();
	const [searchParams] = useSearchParams();
	const [isLoading, setIsLoading] = useState(false);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const debouncedGetMovies = useCallback(
		debounce((newPage = 1) => {
			const searchQuery = searchParams.get('search');
			const apiUrl = searchQuery ? ENDPOINT_SEARCH : ENDPOINT_DISCOVER;

			dispatch(
				fetchMovies({
					apiUrl,
					params: { query: searchQuery, page: newPage },
				})
			);
		}, DEBOUNCE_TIME),
		[searchParams, dispatch]
	);

	const { lastElementRef } = useInfiniteScroll({
		fetchStatus,
		currentPage: page,
		totalPages,
		onLoadMore: debouncedGetMovies,
		hasMoreResults: hasMoreMovies,
	});

	useEffect(() => {
		debouncedGetMovies();
		return () => debouncedGetMovies.cancel();
	}, [debouncedGetMovies]);

	useEffect(() => {
		dispatch(resetMovies());
		setIsLoading(true);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchParams]);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	return (
		<div className="movies-container" data-testid="movies">
			{movies?.map((movie, index) => {
				return (
					<Movie
						movie={movie}
						key={movie.id}
						lastMovieRef={index === movies.length - 1 ? lastElementRef : null}
					/>
				);
			})}
			{(fetchStatus === 'loading' || isLoading) && hasMoreMovies && (
				<div className="loading">Loading more movies...</div>
			)}
		</div>
	);
}
