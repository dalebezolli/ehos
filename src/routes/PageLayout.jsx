import { Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { ContentViewerContext } from '../context/ContentViewerContext';

import ContentPlayer from '../components/ContentPlayer';
import NavBar from '../components/NavBar';
import SideNav from '../components/SideNav';

const PageLayout = _ => {
	const { selectedList } = useContext(ContentViewerContext);

	return (
		<div className='relative'>
			<NavBar />

			<div className='flex h-[90vh]'>
				<SideNav />

				<div className='overflow-x-scroll w-full'>
					<Outlet />
				</div>
			</div>
			
			{
				selectedList.selectedSong &&
				<div className='absolute bottom-0 left-1/2 -translate-x-1/2 container'>
					<ContentPlayer />
				</div>
			}
		</div>
	);
};

export default PageLayout;