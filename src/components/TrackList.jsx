import { usePlayer } from '../context/ContentViewerContext';
import { useAuth } from '../context/AuthContext';
import { addSong } from '../utils/firebase';

const TrackList = ({ tracks }) => {
	return(
		<div>
			{
				tracks.map((track, index) =>
					<TrackListing 
						key={ track.youtubeId } 
						track={ track } 
						position={ index + 1 } 
					/>
				)
			}
		</div>
	);
};

const TrackListing = ({ track, position }) => {
	const { playTrack, queueTrack } = usePlayer();
	const { user } = useAuth();

	const handleSelectTrack = (track) => {
		playTrack(track);
	}
	
	const handleSaveTrack = (event, track) => {
		event.stopPropagation();
		addSong(
			track, user.uid, 
			() => console.log('saved!'), 
			() => console.log('exists.'), 
			() => console.log('error')
		);
	}

	const handleQueueTrack = (event, track) => {
		event.stopPropagation();

		console.log('queuing track...');
		queueTrack(track);
	}

	return (
		<div 
			className='
				group
				flex p-3 text-sm
				text-light-secondary
				hover:bg-dark-secondary rounded-lg
			'
			onClick={ () => handleSelectTrack(track) }
		>
			<div className='flex items-center h-[69px] mr-8'>
				<p>{ position }</p>
			</div>

			<div 
				className='min-w-[86px] h-[69px] bg-[length:190%] bg-center bg-no-repeat rounded-lg mr-4'
				style={{ backgroundImage: `url(${ track.thumbnail })` }} 
			></div>

			<div className='flex-grow'>
				<p className='mb-2 text-md max-h-[1rem] overflow-y-hidden text-light'>{ track.title }</p>
				<p>{ track.author }</p>
			</div>

			<div className='flex justify-center items-center'>
				<p className='mr-2'>00:00</p>
				<div className='invisible group-hover:visible'>
					<button 
						className='hover:text-light'
						onClick={ (event) => { handleSaveTrack(event, track) }}
					>save</button>
					<button 
						className='hover:text-light'
						onClick={ (event) => { handleQueueTrack(event, track) }}
					>queue</button>
				</div>
			</div>
		</div>
	);
}

export default TrackList;