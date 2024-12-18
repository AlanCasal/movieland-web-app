# Code Review Challenge

You can find the code review challenge in [CODEREVIEW.md](/CODEREVIEW.md)

---

## Movieland

React + Redux + RTK + Bootstrap application that fetches movies from [https://www.themoviedb.org/](https://www.themoviedb.org/)

Created with [Create React App](https://github.com/facebook/create-react-app).

## Quick Start

### Docker

### Pre-requisites

- Docker
- Free port: 3000

### Run App with Docker

```bash
# Build app
docker build -t my-react-app .

# Run app
docker run -p 3000:3000 -e REACT_APP_TMDB_API_KEY=your_api_key my-react-app
```

### Run App with npm

### Pre-requisites

- node v16
- Known issues with Python 3.12.6. Suggested Python version: 3.11
- Free port: 3000

### Available Scripts

```bash
# Install all dependencies
npm install

# Run app (Go to http://localhost:3000 in your browser)
npm start

# Run Tests
npm test
```

### Decisions

- implemented a more conventional structure for better organization and readability
- screens and components now have their own folder for better maintainability and reusability
- updated some tests based on code changes
- implemented infinite scroll through `IntersectionObserver`, `isIntersecting` and last element in the screen. This code is within a hook so it can be reused in other screens too
- added `axios` for fetching data for better management and api calls control
- added a `debounce` and use of `axios.CancelToken` to prevent excesive api calls when typing in the searchbox.
- moved `redux` related files inside a `store` folder for better organization and readability
- added `Docker` for easy testing
- added eslint and prettier for code readability and use of good practices

### Areas of improvements

- use BEM with scss and fix organize code better
- remove Bootstrap completely
- organize and improve html
- organize and move functions to helper or hooks to improve code maintainability and scalability
- improve UI
- Avoid direct Node access in tests
