import { dummySearch } from '../data/dummySearch';

const TrackList = ({ tracks }) => {
	console.log(tracks);

	return(
		<div>
			<div id='filters' className='my-6'>
				<p>Filters</p>
			</div>

			<div>
				{
					tracks.map((track, index) =>
						<TrackListing key={ track.youtubeId } track={ track } position={ index + 1 } />
					)
				}
			</div>

		</div>
	);
};

const TrackListing = ({ track, position }) => {
	return (
		<div className='flex h-[69px] justify-between mb-4 text-sm'>
			<div 
				className='min-w-[86px] h-[69px] bg-[length:190%] bg-center bg-no-repeat rounded-lg'
				style={{ backgroundImage: `url(${ track.thumbnail })` }} 
			></div>

			<div className='flex justify-center items-center min-w-[100px] h-full'>
				<p className='text-light-secondary'>{ position }</p>
			</div>

			<div className='flex-grow'>
				<p className='mb-2 text-md max-h-[1rem] overflow-y-hidden'>{ track.title }</p>
				<p className='text-light-secondary'>{ track.author }</p>
				<p className='text-light-secondary'></p>
			</div>

			<div className='flex justify-center items-center'>
				<p className='text-light-secondary'>00:00</p>
			</div>
		</div>
	);
}

export default TrackList;