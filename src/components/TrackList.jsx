import { useRef, useState } from 'react';
import { HiDotsVertical } from 'react-icons/hi';
import { decode } from 'he';

import { usePlayer } from '../context/ContentViewerContext';
import { useUser } from '../context/UserContext';
import TrackPopup from './TrackPopup';
import { deleteTrackFromCollection } from '../utils/firebase';
import { usePopup } from '../routes/PageLayout';

const TrackList = ({ tracks, enabledControls = { save: true, queue: true }, controlHandlers }) => {
	return(
		<div>
			{
				tracks.map((track, index) =>
					<TrackListing 
						key={ track.youtubeId + String(index) } 
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
	const { playTrack, queueTrack, queue } = usePlayer();
	const { user } = useUser();
	const { insertPopup, removePopup } = usePopup();
	const trackPopupRef = useRef();
	const selected = (track.youtubeId === queue?.queuedTracks[queue?.playingTrackIndex]?.youtubeId);

	const [ showTrackOptions, setShowTrackOptions ] = useState(false);

	const handleSelectTrack = (track) => {
		playTrack(track);
	};
	
	const handleSaveTrack = (event, track, onSave) => {
		event.stopPropagation();
		console.log('saving track...');
		trackPopupRef.current = insertPopup(<TrackPopup track={ track } onSave={ onSave } onCancel={ () => { removePopup(trackPopupRef.current) } } />, true);
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
			className={`
				group
				flex py-1.5 text-sm
				text-light-secondary
				hover:bg-[rgba(36,36,38,0.6)] rounded-lg
				cursor-pointer
				${ selected && 'bg-dark-secondary' }
			`}
			onClick={ () => handleSelectTrack(track) }
			onMouseLeave={ () => { setShowTrackOptions(false) } }
		>
			<div className='flex justify-center items-center w-[32px] h-[42px]'>
				{
					selected ? 
					<div className='
						w-0 h-0 
						border-t-[5px] border-t-transparent
						border-l-[10px] border-l-light
						border-b-[5px] border-b-transparent'
					></div>:
					<p>{ position }</p>
				}
			</div>

			<div 
				className='
					w-[42px] h-[42px] 
					bg-[length:180%] bg-center bg-no-repeat rounded-lg'
				style={{ 
					backgroundImage: `${
						selected ? 'linear-gradient(to top right, #0F031Ee0, #0F031E60), ' : '' 
						}url(${ track.thumbnail })` 
				}} 
			></div>

			<div className='px-5 w-[65%]'>
				<p className='text-light text-base'>{ decode(track.title) }</p>
				<p>{ decode(track.author) }</p>
			</div>

			<div className='flex items-center w-[20%]'>
				{
					track.tags.map((tag) => 
						<p key={tag} className='px-2 text-sm'>{ tag }</p>
					)
				}
			</div>
			 
			<div className='flex justify-center items-center w-[5%]'>
				<p>00:00</p>
			</div>

			<div className='flex justify-center items-center'>
				<div className='invisible group-hover:visible relative'>
					<div 
						className='p-2 rounded-full hover:bg-[rgba(36,36,38,0.9)]'
						onClick={
							(event) => { 
								event.stopPropagation(); 
								setShowTrackOptions(!showTrackOptions);
							}}
					>
						<HiDotsVertical />
					</div>				
					
					{ 
						showTrackOptions && (
							<div className='absolute w-[200px] bg-dark-secondary drop-shadow-[0px_0px_5px_#111111FF] right-0 px-4 py-2 rounded-md'>
								{
									enabledControls.save &&
									<button 
										className='hover:text-light py-2 w-full text-left'
										onClick={ 
											(event) => { handleSaveTrack(event, track, controlHandlers?.onSave) }
										}
									>save</button>
								}

								{
									enabledControls.delete &&
									<button 
										className='hover:text-light w-full py-2 text-left'
										onClick={ (event) => { 
											handleDeleteTrack(event, track, controlHandlers?.onDelete);
										}}
									>delete</button>
								}

								{
									enabledControls.queue &&
									<button 
										className='hover:text-light w-full py-2 text-left'
										onClick={ (event) => { handleQueueTrack(event, track) }}
									>queue</button>
								}
							</div>
						)
					}
				</div>
			</div>
		</div>
	);
}

export default TrackList;