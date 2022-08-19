import { useContext, createContext, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { usePlayer } from '../context/ContentViewerContext';

import ContentPlayer from '../components/ContentPlayer';
import NavBar from '../components/NavBar';
import SideNav from '../components/SideNav';

const PageLayout = _ => {
	const { queue } = usePlayer();
	const { playingTrackIndex } = queue;

	return (
		<PopupProvider>
			<div className=''>
				<NavBar />

				<div className={`flex ${ playingTrackIndex !== -1 ? 'h-[80vh]' : 'h-[90vh]' }`}>
					<SideNav />

					<div className='overflow-x-scroll w-full'>
						<Outlet />
					</div>
				</div>
				
				{ playingTrackIndex !== -1 && <ContentPlayer /> }
			</div>
		</PopupProvider>
	);
};

const PopupContext = createContext();

export const usePopup = () => {
	return useContext(PopupContext);
}

const PopupProvider = ({ children }) => {
	const [popups, setPopups] = useState([]);

	const insertPopup = (Element, blur) => {
		if(!Element) return;
		let exists = false;
		popups.forEach(popup => {
			if(!exists && popup.id === Element.id) exists = true;
		});
		if(exists) return;

		if(blur) 
			Element = <div className='
					fixed w-screen h-screen top-0 left-0 z-100 
					bg-[#000000af]
				'>
					{ Element }
				</div>

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

export default PageLayout;