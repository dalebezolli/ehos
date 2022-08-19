import { usePlayer } from '../context/ContentViewerContext';
import { useUser } from '../context/UserContext';
import { useTrackPopup } from './TrackPopup';
import { deleteTrackFromCollection } from '../utils/firebase';

const TrackList = ({ tracks, enabledControls = { save: true, queue: true }, controlHandlers }) => {
	return(
		<div>
			{
				tracks.map((track, index) =>
					<TrackListing 
						key={ track.youtubeId } 
						track={ track } 
						position={ index + 1 } 
						enabledControls={ enabledControls }
						controlHandlers={ controlHandlers }
					/>
				)
			}
		</div>
	);
};

const TrackListing = ({ track, position, enabledControls, controlHandlers }) => {
	const { playTrack, queueTrack } = usePlayer();
	const { user } = useUser();
	const { displayTrack } = useTrackPopup();

	const handleSelectTrack = (track) => {
		playTrack(track);
	};
	
	const handleSaveTrack = (event, track, onSave) => {
		event.stopPropagation();
		displayTrack(track, onSave);
	};

	const handleDeleteTrack = (event, track, onDelete) => {
		event.stopPropagation();
		deleteTrackFromCollection(track, user.uid);
		onDelete && onDelete(track);
	};

	const handleQueueTrack = (event, track) => {
		event.stopPropagation();

		console.log('queuing track...');
		queueTrack(track);
	};

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
				<div className='flex'>
					{
						track.tags.map((tag) => 
							<p key={tag} className='bg-primary rounded-full text-light px-2 text-tiny'>{ tag }</p>
						)
					}
				</div>
			</div>

			<div className='flex justify-center items-center'>
				<p className='mr-2'>00:00</p>
				<div className='invisible group-hover:visible'>
					{
						enabledControls.save &&
						<button 
							className='hover:text-light'
							onClick={ 
								(event) => { handleSaveTrack(event, track, controlHandlers?.onSave) }
							}
						>save</button>
					}

					{
						enabledControls.delete &&
						<button 
							className='hover:text-light'
							onClick={ (event) => { 
								handleDeleteTrack(event, track, controlHandlers?.onDelete);
							}}
						>delete</button>
					}

					{
						enabledControls.queue &&
						<button 
							className='hover:text-light'
							onClick={ (event) => { handleQueueTrack(event, track) }}
						>queue</button>
					}
				</div>
			</div>
		</div>
	);
}

export default TrackList;