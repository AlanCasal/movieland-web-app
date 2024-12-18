import ReactPlayer from 'react-player';

const YoutubePlayer = ({ videoKey }) =>
	videoKey ? (
		<ReactPlayer
			className="video-player"
			url={`https://www.youtube.com/watch?v=${videoKey}`}
			controls={true}
			playing={true}
			width="100%"
			height="450px"
			data-testid="youtube-player"
		/>
	) : (
		<div style={{ padding: '30px' }}>
			<h6>no trailer available. Try another movie</h6>
		</div>
	);

export default YoutubePlayer;
