import { useContext } from 'react';
import { ContentViewerContext } from '../context/ContentViewerContext';

import MusicList from '../components/MusicList';
import ContentPlayer from '../components/ContentPlayer';

const Routes = _ => {
	const { selectedList } = useContext(ContentViewerContext);

	return (
		<div>
			<div className='container mx-auto pt-3'>
				<MusicList /> 
			</div>

			<div className='mx-auto container'>
				{
					selectedList.selectedSong && (
						<div className='fixed bottom-0 container mx-auto'>
							<ContentPlayer currentSong={ selectedList.selectedSong } />
						</div>
					)
				}
			</div>
		</div>
	);
}

export default Routes;