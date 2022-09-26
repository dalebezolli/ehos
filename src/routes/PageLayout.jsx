import { useContext, createContext, useState, useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { usePlayer } from '../context/ContentViewerContext';

import ContentPlayer from '../components/ContentPlayer';
import NavBar from '../components/NavBar';
import SideNav from '../components/SideNav';
import Changelog from '../components/Changelog';


const PageSetup = ({children}) => {
	return (
		<PopupProvider>
			<PageLayout />
		</PopupProvider>
	);
};

const PageLayout = _ => {
	const { queue } = usePlayer();
	const { playingTrackIndex } = queue;

	const { insertPopup, removePopup } = usePopup();
	const changelogPopupRef = useRef();

	useEffect(() => {
		if(changelogPopupRef.current)	return;

		changelogPopupRef.current = insertPopup(
			<Changelog onCancel={ () => { 
				removePopup(changelogPopupRef.current) 
			} } /> 
		);
	}, []);

	return (
			<div>
				<NavBar />

				<div className={`pt-[100px] ${(playingTrackIndex === -1) ? '' : 'pb-[64px]'}`}>
					<Outlet />
				</div>
				{ playingTrackIndex !== -1 && <ContentPlayer /> }
			</div>
	);
};

const PopupContext = createContext();

export const usePopup = () => {
	return useContext(PopupContext);
}

const PopupProvider = ({ children }) => {
	const [popups, setPopups] = useState([]);

	const insertPopup = (Element) => {
		if(!Element) return;
		let exists = false;
		popups.forEach(popup => {
			if(!exists && popup.id === Element.id) exists = true;
		});
		if(exists) return;

		setPopups([
			...popups, 
			<div key={ popups.length }>{ Element }</div>
		]);

		return popups.length;
	};

	const removePopup = (popupId) => {
		setPopups(popups.filter((popup, index) => index !== popupId));
	}

	const value = { insertPopup, removePopup };

	return (
		<PopupContext.Provider value={ value }>
			{
				popups		 
			}

			{ children }
		</PopupContext.Provider>
	);
}

export default PageSetup;