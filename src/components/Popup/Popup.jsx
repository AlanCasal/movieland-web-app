import React from 'react';
import 'reactjs-popup/dist/index.css';
import ReactPopup from 'reactjs-popup';
import './styles.scss';

const Popup = ({ isOpen, handleCloseModal, children }) => {
	return (
		<ReactPopup open={isOpen} onClose={handleCloseModal} modal>
			<button
				type="button"
				className="close"
				onClick={handleCloseModal}
				aria-label="Close"
			>
				<span aria-hidden="true">&times;</span>
			</button>
			{children}
		</ReactPopup>
	);
};

export default Popup;
