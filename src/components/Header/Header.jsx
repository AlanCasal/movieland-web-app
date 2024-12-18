import { useSelector } from 'react-redux';
import {
	createSearchParams,
	Link,
	NavLink,
	useSearchParams,
} from 'react-router-dom';
import './styles.scss';

const Header = () => {
	const { starredMovies } = useSelector(state => state.starred);

	const [searchParams, setSearchParams] = useSearchParams();
	const searchQuery = searchParams.get('search') || '';

	const getSearchResults = query => {
		if (query) setSearchParams(createSearchParams({ search: query }));
		else setSearchParams();
	};

	const handleOnChange = e => {
		getSearchResults(e.target.value);
	};

	const handleClearResults = () => {
		getSearchResults('');
	};

	const starredMoviesLabel = `Starred movies ${
		starredMovies.length > 0 ? `(${starredMovies.length})` : ''
	}`;

	return (
		<header className="header">
			<Link
				to="/"
				data-testid="home"
				onClick={handleClearResults}
				aria-label="Home"
			>
				<i className="bi bi-film" aria-hidden="true" />
			</Link>

			<nav>
				<NavLink
					to="/starred"
					data-testid="nav-starred"
					aria-label={starredMoviesLabel}
				>
					{starredMovies.length > 0 ? (
						<>
							<i
								className="bi bi-star-fill bi-star-fill-white"
								aria-hidden="true"
							/>
							<sup className="star-number">{starredMovies.length}</sup>
						</>
					) : (
						<i className="bi bi-star" aria-hidden="true" />
					)}
				</NavLink>
				<NavLink
					to="/watch-later"
					className="nav-fav"
					aria-label="Watch later movies"
				>
					watch later
				</NavLink>
			</nav>

			<div className="input-group rounded">
				<Link
					to="/"
					onClick={handleClearResults}
					className="search-link"
					aria-label="Clear search and go home"
				>
					<input
						value={searchQuery}
						type="search"
						data-testid="search-movies"
						onChange={handleOnChange}
						className="form-control rounded"
						placeholder="Search movies..."
						aria-label="Search movies"
						aria-describedby="search-addon"
					/>
				</Link>
			</div>
		</header>
	);
};

export default Header;
