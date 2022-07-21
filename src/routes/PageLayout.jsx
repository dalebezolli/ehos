import { Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { ContentViewerContext } from '../context/ContentViewerContext';

import ContentPlayer from '../components/ContentPlayer';
import NavBar from '../components/NavBar';

const PageLayout = _ => {
	const { selectedList } = useContext(ContentViewerContext);

	return (
		<div className='relative h-screen'>
			<NavBar />

			<div className='container mx-auto pt-3'>
				<Outlet />
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