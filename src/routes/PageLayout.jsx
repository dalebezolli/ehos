import { Outlet } from 'react-router-dom';
import { usePlayer } from '../context/ContentViewerContext';

import ContentPlayer from '../components/ContentPlayer';
import NavBar from '../components/NavBar';
import SideNav from '../components/SideNav';

const PageLayout = _ => {
	const { queue } = usePlayer();
	const { playingTrackIndex } = queue;

	return (
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
	);
};

export default PageLayout;