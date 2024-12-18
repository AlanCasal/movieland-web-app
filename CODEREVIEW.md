# Code Review

## TASKS

> #### As a User, I can search for movies and view a list of results
>
> - searchbar is updating URL but it's not finding any results

> #### As a User, I can add and remove movies from a “my favourites” list
>
> - since searchbar is not finding any movie, I can't star any movie

> #### As a User, I can add and remove movies I want to watch, like the “watch later” functionality on YouTube.
>
> - since searchbar is not finding any movie, 'watch later' is always empty

## GENERAL SUGGESTIONS

- use of propTypes could be useful although it's deprecated, consider using TypeScript or Flow for type safety

- add `linter` and `prettier` for code consistency, formatting, style, indentation, etc

- should leave this file an app container, and move the content to a Home screen component or feature Same for other screens

- consider using BEM methodology for naming classes for better readability and maintainability

- consider using an icon for Watch Later button, or a text label for starred movies for UI consistency and better accessibility

- test folder should be named `__tests__` following the convention

- consider adding a `__mocks__` folder for better readability, maintainability and scalability, and could also drop the `.mocks.js` name

- consider adding a utils for testing utilities and helpers within the test folder

- Could change `App.js` to `App.jsx` since it contains JSX code and is a React component

- UI: consider adding some spacing/padding/margins for small screens

- Bug: on small screen sizes, when user clicks on movie card and then another movie card, these cards dissapear from the list.
  - ..and if then clicking on `X` for closing the movie card, the show the previous movie. It's like they're stacking instead of closing the previous one, and opening a new one

## [package.json](/package.json)

Consider adding suuport to IE11 if needed

```bash
{
  # ...rest of the code...
  "browserslist": {
  "production": [
  "ie 11", # If IE11 support is needed,
  # ...rest of the code...,
  ],
  # ...rest of the code...,
}
```

## [manifest.json](/public/manifest.json)

- [(line 2)](/public/manifest.json#L2) Rename app to something more meaningful

```bash
# Current
"short_name": "React App",
"name": "Create React App Sample"

# Improvement
"short_name": "React App",
"name": "Create React App Sample",
```

## [index.html](/public/index.html)

```bash
# meta tag description should have a more meaningful name, like
<meta name="description" content="Movieland - Search and discover your favorite movies" />

# since requirements mention 'that Bootstrap is not allowed', Bootstrap imports should be removed
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" ... />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.2/font/bootstrap-icons.css">

# This one Prevents MIME type sniffing security vulnerabilities, it's a security good practice, but their importance depends on the app's needs
<meta http-equiv="X-Content-Type-Options" content="nosniff">
```

## [README.md](/README.md)

add pre requirements in `README.md` since app won't work with newer `Node` versions, nor `Python v3.12+`
In my case I had to:

- switch to node v16
- I was using python3 -V -> Python 3.12.6 and I was getting error, so I used python3.11
- brew install python@3.11
- npm config set python /opt/homebrew/opt/python@3.11/bin/python3.11

## [App.js](/src/App.js)

- should split code and use maybe a custom hook for movies and trailer, or a utils file for cleaner code

- [(line 4)](src/App.js#L4) is `import 'reactjs-popup/dist/index.css';` being actually used?

- [(line 15)](/src/App.js#L15) current selector is getting the entire state when only movies is being used

```bash
# Current
const state = useSelector(state => state)
const { movies } = state

# Improvement
const movies = useSelector((state) => state.movies)
```

- [(line 21)](/src/App.js#L21) `isOpen` is assigned a value but never used. Either implement it or remove it

- [(line 24)](/src/App.js#L24) `closeModal` is assigned but never used. Either implement it or remove it

- [(line 26)](/src/App.js#L26) `closeCard` functions is empty

- [(line 30)](/src/App.js#L30)
  - consider adding a debounce to prevent too many fetch requests
  - consider using only template literals for consistency

```bash
# Current
dispatch(fetchMovies(`${ENDPOINT_SEARCH}&query=` + query));

# Improvement
dispatch(fetchMovies(`${ENDPOINT_SEARCH}&query=${query}`));
```

- [(line 39)](/src/App.js#L39) no need of `navigate('/');` here since [Header.jsx](/src/components/Header.jsx#L12) is using `to="/"` in `<Link to="/" data-testid="home" onClick={() => searchMovies('')}>`

- [(line 43)](/src/App.js#L43) and [(line 71)](/src/App.js#L71) Could be improved by

- [(line 44)](/src/App.js#L44) consider a refactor like

```bash
const apiUrl = searchQuery
  ? `${ENDPOINT_SEARCH}&query=${searchQuery}`
  : ENDPOINT_DISCOVER;

dispatch(fetchMovies(apiUrl));
```

```bash
# Current
useEffect(() => {
  getMovies();
}, []);

# Improvement
const getMovies = useCallback(() => {
  if (searchQuery) {
      dispatch(fetchMovies(`${ENDPOINT_SEARCH}&query=` + searchQuery));
  } else {
      dispatch(fetchMovies(ENDPOINT_DISCOVER));
  }
}, [searchQuery, dispatch]);

useEffect(() => {
  getMovies();
}, [getMovies]);

# Memoization: useCallback will memoize the getMovies function and only recreate it when its dependencies (searchQuery or dispatch) change
# Explicit Dependencies: It makes the dependencies more explicit and easier to track. The effect depends on getMovies, which in turn depends on searchQuery and dispatch
# ESLint Compliance: This approach satisfies the exhaustive-deps ESLint rule without creating any potential issues
# Predictable Behavior: The effect will run when either:
#  - The component mounts
#  - searchQuery changes
#  - dispatch changes (which shouldn't happen as Redux's dispatch is stable)
```

- [(line 51)](/src/App.js#L51) The conditional check if (!videoKey) is redundant since setOpen(true) is called regardless

```bash
# Current
const viewTrailer = (movie) => {
  getMovie(movie.id);
  if (!videoKey) setOpen(true);
  setOpen(true);
};

# Improvement: depending on the intent, it could be improved by
# a)
const viewTrailer = (movie) => {
  getMovie(movie.id);
  setOpen(true);
};

# or b)
const viewTrailer = (movie) => {
  if (videoKey) return;

  getMovie(movie.id);
  setOpen(true);
};
```

- [(line 58)](/src/App.js#L58) Missing error handling for the fetch request. Consider using try/catch

- [(line 61)](/src/App.js#L61) consider using try/catch.

  - Also response.json(); returns a promise so it would need an `await`. The same applies in [Movie.jsx](/src/components/Movie.jsx#L35) and [moviesSlice.js](/src/data/moviesSlice.js#L5)
  - `response.json()` method is asynchronous. Parsing JSON can be computationally expensive for large payloads, and doing it synchronously could block the main thread. That's why the Fetch API was designed to handle this asynchronously.

- [(line 63)](/src/App.js#L63), [(line 64)](/src/App.js#L64), [(line 65)](/src/App.js#L65) should use optional chaining for safer access to data and can also use destructuring

- [(line 75)](/src/App.js#L75) `searchParams={searchParams}` and `setSearchParams={setSearchParams}` params are sent to `Header` but are not used

## [app.scss](/src/app.scss)

- [(line 1)](/src/app.scss#L1) Using both ID and class selectors. Consider using consistent class selectors

- Consider using CSS variables for potentially reusable values

```bash
# Current
#root {
  # ...
}
.App {
  # ...
}

# Improvement:
:root {
  --min-height: 850px;
  --gradient-start: #1CB5E0;
  --gradient-end: #050b45;
  --animation-duration: 0.3s;
  --animation-timing: cubic-bezier(0.38, 0.1, 0.36, 0.9);
  --shadow-color: rgba(241, 241, 241, 0);
}

.root {
  height: 100%;
  min-height: var(--min-height);
  background: linear-gradient(0deg, var(--gradient-start) 20%, var(--gradient-end) 100%) no-repeat;
}

.App {
  # ...rest of the code...

  @keyframes anvil {
    0% {
      box-shadow: 0 0 0 var(--shadow-color);
      opacity: 0;
      transform: scale(1) translateY(0);
    }
    1% {
      box-shadow: 0 0 0 var(--shadow-color);
      opacity: 0;
      transform: scale(0.96) translateY(0.625rem); // 10px to rem
    }
    100% {
      box-shadow: 0 0 31.25rem var(--shadow-color); // 500px to rem
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  # ...rest of the code...
}
```

- [(line 31)](/src/app.scss#L31), [(line 32)](/src/app.scss#L32), [(line 33)](/src/app.scss#L33) and [(line 35)](/src/app.scss#L35) no need to add vendor prefixes lines
- Create React App uses PostCSS and autoprefixer, and package.json already has the browserslist
- so css support for browsers is already handled

- [(line 38)](/src/app.scss#L38) Consider using `rem` units for better accessibility

```bash
.video-player {
  height: 60vw; // Consider adding min/max height constraints
}

# If a user changes their browser's font size for accessibility:

# With px
height: 60px; # Always stays 60 pixels

# With rem
height: 3.75rem; # Scales with user's font size preferences

# Improvement:
.video-player {
  height: 60vw;         // 60vw because it's already a relative unit (viewport width)
  min-height: 18.75rem; // Prevent too small height (300px ÷ 16px = 18.75rem)
  max-height: 80vh;     // Prevent too large height
}
```

- Consider splitting code and using
  - `_variables.scss` file for variables
  - `_base.scss` for resets and \_mixins.scss for mixins
  - `_animations.scss` for animations,
  - `_main.scss` that imports all others

## [constants.js](/src/constants.js)

- [(line 1)](/src/constants.js#L1) API*KEY is exposed, should be in .env file and accessed via process.env.API_KEY (make sure to start the name with `REACT_APP*`REST_OF_THE_NAME)

```bash
export const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;
```

- [(line 2)](/src/constants.js#L2) consider following a better naming convention for the variables

```bash
export const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export const TMDB_ENDPOINTS = {
  DISCOVER: `${TMDB_BASE_URL}/discover/movie/?api_key=${TMDB_API_KEY}&sort_by=vote_count.desc`,
  SEARCH: `${TMDB_BASE_URL}/search/movie/?api_key=${TMDB_API_KEY}`,
  GET_MOVIE: (movieId) => `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=videos`
};
```

- [(line 3)](/src/constants.js#L3) and [(line 4)](/src/constants.js#L4) Forward slash before the question mark is incorrect. Query parameters should be separated from the path using a `?`, not `/?`

- [(line 5)](/src/constants.js#L5) hardcoded movie id, should be dynamic

## [index.css](/src/index.css)

- Consider adding a box-sizing property to ensure consistent sizing across elements:

```bash
body {
  margin: 0;
  box-sizing: border-box;
  # ...rest of the code...
}

*, *::before, *::after {
  box-sizing: inherit;
}
```

- consider adding a default text color and background color to ensure consistent rendering across different browsers:

```bash
body {
  # ...rest of the code...
  color: #333;
  background-color: #fff;
}
```

- Consider adding a line-height property to improve text readability:

```bash
body {
  # ...rest of the code...
  line-height: 1.5;
}
```

- [(line 11)](/src/index.css#L11) Consider adding some basic styling to make code snippets stand out better:

```bash
# ...rest of the code...
code {
  # ...rest of the code...
  background-color: #f5f5f5;
  padding: 0.2em 0.4em;
  font-size: 0.9rem; # 0.9rem = 14.4px, references the root element's font size (typically 16px by default), making it more predictable
}
```

- Consider splitting code and using (also mentioned in app.scss)
  - `_variables.scss` file for variables,
  - `_base.scss` for resets and \_mixins.scss for mixins,
  - `_animations.scss` for animations,
  - `_main.scss` that imports all others
  - delete `index.css` and `app.scss`. This approach is more scalable and maintainable and follows SCSS best practices

## [Header.jsx](/src/components/Header.jsx)

- [(line 33)](/src/components/Header.jsx#L33) input should use onChange instead of onKeyUp

  - better accessibility, it works for all input methods
  - it won't miss any input change since it trogger whenever the input changes

- add aria-label to nav elements for better accessibility

- some classes like visually-hidden or rounded are not used anywhere. If they are from bootstrap, they should be removed

- [(line 11)](/src/components/Header.jsx#L11) header should have a className to be used in scss
  - header is too generic and may conflict with other headers
  - header has lower specificity than a class selector
  - using a className will make it easier to style and target the header and maintain it

## [header.scss](/src/styles/header.scss)

- instead of using element selectors like `header`, `input`, `button`, consider using a class selectors

  - it will make it easier to style and target the elements and maintain it
  - it will make the code more readable and easier to understand
  - avoids unintentional side effects when using element selectors
  - follows SCSS best practices

- consider use variables for reusable values. I.E. `$color-white: #fff;` and moved them to `_variables.scss`

- [(line 13)](/src/styles/header.scss#L13), [(line 38)](/src/styles/header.scss#L38), [(line 79)](/src/styles/header.scss#L79) consider using flexbox instead of floats for better layout control

- [(line 58)](/src/styles/header.scss#L58) consider using gap instead of margin for better spacing control

- [(line 2)](/src/styles/header.scss#L2), [(line 3)](/src/styles/header.scss#L3) consider avoiding the use of unnecessary `position: fixed` and `z-index`

## [Movie.jsx](/src/components/Movie.jsx)

- some classes suggest bootstrap usage but requirements mention 'that Bootstrap is not allowed'

- [(line 6)](/src/components/Movie.jsx#L6) closeCard is not being used, should be removed

- [(line 16)](/src/components/Movie.jsx#L16) should use better code readability and maintainability

```bash
# Current
const myClickHandler = (e) => {
  if (!e) var e = window.event
  e.cancelBubble = true
  if (e.stopPropagation) e.stopPropagation()
  e.target.parentElement.parentElement.classList.remove('opened')
}

# Improvement:
const handleClose = (e) => {
  e.stopPropagation()
  e.currentTarget.closest('.card').classList.remove('opened')
}
```

- [(line 30)](/src/components/Movie.jsx#L30) and [(line 47)](/src/components/Movie.jsx#L47) map could be refactored to constant and maybe even memoized and maybe even memoized

```bash
# Improvement:
const isStarred = starred.starredMovies.map(movie => movie.id).includes(movie.id)
const isWatchLater = watchLater.watchLaterMovies.map(movie => movie.id).includes(movie.id)

# Improvement with memoization:
const isStarred = useMemo(() =>
  starred.starredMovies.map(m => m.id).includes(movie.id),
  [starred.starredMovies, movie.id]
)

const isWatchLater = useMemo(() =>
  watchLater.watchLaterMovies.map(m => m.id).includes(movie.id),
  [watchLater.watchLaterMovies, movie.id]
)
```

- [(line 31)](/src/components/Movie.jsx#L31), [(line 43)](/src/components/Movie.jsx#L43) consider using button elements instead of span for better accessibility

- [(line 32)](/src/components/Movie.jsx#L32) and [(line 48)](/src/components/Movie.jsx#L48) should use a map helper

```bash
# Improvement:
dispatch(starMovie(formattedMovieData(movie)))

const formattedMovieData = (movie) => ({
  id: movie.id,
  overview: movie.overview,
  release_date: movie.release_date?.substring(0, 4),
  poster_path: movie.poster_path,
  title: movie.title
})

# could also add some validation like
if (!movie.id || !movie.title) {
  console.error('Invalid movie data');
  return;
}
```

- [(line 48)](/src/components/Movie.jsx#L48), [(line 56)](/src/components/Movie.jsx#L56), [(line 58)](/src/components/Movie.jsx#L58) buttons should have aria-label for better accessibility for screen readers

- [(line 56)](/src/components/Movie.jsx#L56) consider moving the button elements to separate components for better readability, maintainability and reusability

- [(line 60)](/src/components/Movie.jsx#L60)
  - image url should be moved to constants, and maybe even sanitized or validated
  - alt text should could also display the movie title for better accessibility

## [watchLaterSlice.js](/src/data/watchLaterSlice.js)

- consider maybe adding a timestamp for when movies are added

- consider using localStorage for persistence, or even better redux-persist

- [(line 14)](/src/data/watchLaterSlice.js#L14) consider adding a check for `indexOfId !== -1`

- [(line 16)](/src/data/watchLaterSlice.js#L16) typo in `remveAllWatchLater`, should be `removeAllWatchLater`

## [starredSlice.js](/src/data/starredSlice.js)

- [(line 13)](/src/data/starredSlice.js#L13) consider adding a check for `indexOfId !== -1`

## [Movies.jsx](/src/components/Movies.jsx)

- [(line 8)](/src/components/Movies.jsx#L8) consider destructuring movies.movies one more step in father component

## [movies.scss](/src/styles/movies.scss)

- consider splitting code to movie.scss since most of the styles are for the movie component

- consider using variables for colors and other repeated values and move them to `_variables.scss`

- consider `@mixins` and `@content` for media query breakpoints and move them to `_mixins.scss`

- [(line 22)](/src/styles/movies.scss#L22), [(line 23)](/src/styles/movies.scss#L23), [(line 24)](/src/styles/movies.scss#L24), [(line 25)](/src/styles/movies.scss#L25) just like in app.scss, no need to add vendor prefixes lines
- Create React App uses PostCSS and autoprefixer, and package.json already has the browserslist
- so css support for browsers is already handled

- [(line 247)](/src/styles/movies.scss#L247), [(line 280)](/src/styles/movies.scss#L280) Consider creating `z-index` variables for better layer management

```bash
$z-layers: (
  'modal': 999,
  'overlay': 998
);
```

## [Starred.jsx](/src/components/Starred.jsx)

- [(line 9)](/src/components/Starred.jsx#L9), [(line 10)](/src/components/Starred.jsx#L10) consider destructuring starred directly, starredMovies is the only property being used

- [(line 16)](/src/components/Starred.jsx#L16) and [(line 33)](/src/components/Starred.jsx#L33) consider using ternary condition

```bash
starredMovies.length > 0 ? ... : ...
```

- [(line 17)](/src/components/Starred.jsx#L17) Starred Movies should be an h2, this is important for SEO and scan readers accessibility

- [(line 19)](/src/components/Starred.jsx#L19) consider using a map helper to get the starred movies or maybe even `Movies.jsx`

- [(line 28)](/src/components/Starred.jsx#L28) `footer` is meant for site footer content

## [starred.scss](/src/styles/starred.scss)

- consider using variables for `font-size` values and colors for UI consistency and maintainability

- [(line 3)](/src/styles/starred.scss#L3) consider a class instead of `footer` for better readability and maintainability

- [(line 6)](/src/styles/starred.scss#L6), [(line 18)](/src/styles/starred.scss#L18), [(line 23)](/src/styles/starred.scss#L23) unused class `.total-price` and `.back-button`

- [(line 14)](/src/styles/starred.scss#L14) consider using a variable instead of a hardcoded value

## [WatchLater.jsx](/src/components/WatchLater.jsx)

- [(line 9)](/src/components/WatchLater.jsx#L9), [(line 10)](/src/components/WatchLater.jsx#L10) consider destructuring watchLater directly, watchLaterMovies is the only property being used

- [(line 11)](/src/components/WatchLater.jsx#L11), [(line 29)](/src/components/WatchLater.jsx#L29) Typo in `remveAllWatchLater`, should be `removeAllWatchLater`

- [(line 16)](/src/components/WatchLater.jsx#L16) and [(line 33)](/src/components/WatchLater.jsx#L33) consider using ternary condition

```bash
watchLaterMovies.length > 0 ? ... : ...
```

- [(line 28)](/src/components/WatchLater.jsx#L28) footer is meant for site footer content

- [(line 33)](/src/components/WatchLater.jsx#L33)
  - consider using a more descriptive name instead of empty-cart, maybe empty-watch-later
  - consider cerating a separate and reusable component for empty-cart

## [YoutubePlayer.jsx](/src/components/WatchLater.jsx)

- Consider using an error handler in case `ReactPlayer` fails to load

- [(line 5)](/src/components/YoutubePlayer.jsx#L5) consider moving the URL to `constants.js`

## [App.test.js](/src/App.test.js)

- test descriptions should be more descriptive and precise
  I.E:

```bash
it('should display watch later link in navigation')
```

- `App.test.js` should be inside test folder for structure consistency, since the rest of the tests are there

- Should implement suite grouping with describe blocks, I.E:

```bash
describe('renders components', () => {
  it('should display watch later link in navigation', ...)
  it('should render starred component', ...)
  ...
})
```

- `renderWithProviders(<App />)` is repeated in every test, should use it in a beforeEach block

```bash
describe('App', () => {
  beforeEach(() => {
    renderWithProviders(<App />)
  })
  # ...rest of the code...
})
```

- Some tests use `userEvent.setup()`, others don't, should standardize the approach

```bash
let user
beforeEach(() => {
  user = userEvent.setup()
  renderWithProviders(<App />)
})
```

- Using `getByTestId` should be a last resort. Consider using `getByRole`, `getByLabelText`, `getByPlaceholderText`, or `getByText` instead of `getByTestId` when possible for better accessibility

## [movie.test.js](/src/test/movie.test.js)

- Test is doing multiple things. Consider splitting it into separate tests

- consider adding a common setup in a `beforeEach` block

- consider adding assertions for Redux state changes

## [movieSlice.test.js](/src/test/movieSlice.test.js)

- [(line 8)](/src/test/movieSlice.test.js#L8) initialState
  - initialState is not being used for assertions, it's just being passed to the reducer
  - initialState is repeated in every test, consider moving it to a constant outside the describe block
  - initialState should be refactored to

```bash
    const initialState = {
      movies: [],
      fetchStatus: ''
    }
```

- [(line 12)](/src/test/movieSlice.test.js#L12) consider testing actual state change

```bash
const newState = moviesSlice.reducer(initialState, action)
expect(newState.fetchStatus).toBe('loading')
```

- [(line 24)](/src/test/movieSlice.test.js#L24) consider testing movies and fetch status

```bash
const newState = moviesSlice.reducer(initialState, action)
expect(newState.movies).toEqual(moviesMock)
expect(newState.fetchStatus).toBe('success')
```

- [(line 27)](/src/test/movieSlice.test.js#L27) consider a better approach

```bash
const newState = moviesSlice.reducer(initialState, action)
expect(newState.fetchStatus).toBe('error')
```

## [watchLater.test.js](/src/test/watchLater.test.js)

- Test searches and adds a movie to watch later but doesn't verify it was added

- There's no test for removing a movie from watch later

- There's no state change test

- [(line 19)](/src/test/watchLater.test.js#L19) remove commented code

## [watchLaterSlice.test.js](/src/test/watchLaterSlice.test.js)

- [(line 9)](/src/test/watchLaterSlice.test.js#L9)
  - should use slice's actual initial state
  - initialState is being created multiple times, consider moving it to a constant outside the describe block

```bash
  - const initialState = watchLaterSlice.getInitialState()
```

- [(line 11)](/src/test/watchLaterSlice.test.js#L11) consider testing redux initialization

```bash
# Current:
const initialState = state
const action = { type: '' }
const result = watchLaterSlice.reducer(initialState, action)

# Improvement:
const result = watchLaterSlice.reducer(undefined, { type: '' })
```

- [(line 16)](/src/test/watchLaterSlice.test.js#L16) state already has `watchLaterMovies: []`

- [(line 31)](/src/test/watchLaterSlice.test.js#L31) `remveAllWatchLater` typo, should be `removeAllWatchLater` and fix in other locations too

- [(line 33)](/src/test/watchLaterSlice.test.js#L33) consider using `expect(result.watchLaterMovies).toHaveLength(0)`
