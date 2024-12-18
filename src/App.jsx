import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './features/Home';
import Starred from './features/Starred';
import WatchLater from './features/WatchLater';
import './app.scss';

export const NOT_FOUND_MESSAGE = 'Page Not Found';

const App = () => {
	return (
		<div className="app">
			<Header />
			<main className="container">
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/starred" element={<Starred />} />
					<Route path="/watch-later" element={<WatchLater />} />
					<Route
						path="*"
						element={<h1 className="not-found">{NOT_FOUND_MESSAGE}</h1>}
					/>
				</Routes>
			</main>
		</div>
	);
};

export default App;
