import { Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { ContentViewerContext } from '../context/ContentViewerContext';

import ContentPlayer from '../components/ContentPlayer';
import NavBar from '../components/NavBar';

const PageLayout = _ => {
	const { selectedList } = useContext(ContentViewerContext);

	return (
		<div>
			<NavBar />

			<div className='container mx-auto pt-3'>
				<Outlet />
			</div>

			{
				selectedList.selectedSong && (
					<div className='mx-auto container'>
						<div className='fixed bottom-0 container mx-auto'>
							<ContentPlayer currentSong={ selectedList.selectedSong } />
						</div>
					</div>
				)
			}
		</div>
	);
};

export default PageLayout;