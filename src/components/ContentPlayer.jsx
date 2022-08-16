import YouTube from 'react-youtube';
import { useState, useContext, useEffect, useCallback } from 'react';
import { ContentViewerContext } from '../context/ContentViewerContext';

import { getResourceId, formatSecondsToTime } from '../utils/helpers';

import { FaPause, FaPlay, FaVolumeMute, FaVolumeDown, FaVolumeUp } from 'react-icons/fa';
import { MdRepeat, MdOutlineRepeatOne, MdSkipNext, MdSkipPrevious } from 'react-icons/md';

const ContentPlayer = _ => {
	const { selectedList, queue, playPrevTrack, playNextTrack } = useContext(ContentViewerContext);
	const { playingTrackIndex, queuedTracks } = queue;

	const [ player, setPlayer ] = useState({ 
		status: 'empty',
		repeat: 'none',
		playerHandler: null,
		currentTime: 0,
		currentTimeIntervalHandle: null,
		progressBar: 0,
		progressBarIntervalHandle: null,
		duration: 0,
		volume: 50,
		showYtIframe: false,
		showVolumeControl: false,
	});
	
	useEffect(() => {
		document.addEventListener('keydown', handlePlayerShortcuts);	

		return () => {
			document.removeEventListener('keydown', handlePlayerShortcuts);
		}
	});
	
	useEffect(_ => {
		console.log(queuedTracks[playingTrackIndex]?.youtubeId, 'status:', player.status, player.playerHandler && player.playerHandler.getPlayerState());
		if(player.status === 'playing') {
			let timeInterval = player.currentTimeIntervalHandle;
			let progressBarInterval = player.progressBarIntervalHandle;
			player.playerHandler.setVolume(player.volume);

			console.log(queuedTracks[playingTrackIndex]?.youtubeId, 'playing', timeInterval, progressBarInterval);
			if(timeInterval === null) {
				timeInterval = setInterval(() => { 
					updatePlayerTimeDisplay(player.playerHandler.getCurrentTime());
				}, 200);

				console.log(queuedTracks[playingTrackIndex]?.youtubeId, 'timeInterval:', timeInterval);
			}
		
			if(progressBarInterval === null) {
				progressBarInterval = setInterval(() => { 
					updatePlayerProgressBar(player.playerHandler.getCurrentTime(), player.playerHandler.getDuration()); 
				}, 200);

				console.log(queuedTracks[playingTrackIndex]?.youtubeId, 'progressBarInterval:', progressBarInterval);
			}

			setPlayer({ 
				...player, 
				duration: player.playerHandler.getDuration(),
				currentTimeIntervalHandle: timeInterval,
				progressBarIntervalHandle: progressBarInterval,
			});
		}

		if(player.status === 'empty' && player.currentTimeIntervalHandle !== null) {
			let currentTimeIntervalHandle = player.currentTimeIntervalHandle;
			let progressBarIntervalHandle = player.progressBarIntervalHandle;

			console.log(queuedTracks[playingTrackIndex]?.youtubeId, 'cleanup...', player.currentTimeIntervalHandle, player.progressBarIntervalHandle);
			if(player.currentTimeIntervalHandle !== null) {
				console.log(queuedTracks[playingTrackIndex]?.youtubeId, 'cleanup timeInterval:', currentTimeIntervalHandle);
				clearInterval(player.currentTimeIntervalHandle);
				currentTimeIntervalHandle = null;
			}

			if(player.progressBarIntervalHandle !== null) {
				console.log(queuedTracks[playingTrackIndex]?.youtubeId, 'cleanup progressBarInterval:', progressBarIntervalHandle);
				clearInterval(player.progressBarIntervalHandle);
				progressBarIntervalHandle = null;
			}
			setPlayer({ ...player, currentTimeIntervalHandle, progressBarIntervalHandle });
		}

	}, [player.status]);

	useEffect(() => {
		if(player.playerHandler) player.playerHandler.setVolume(player.volume);
	}, [player.volume]);

	const updatePlayerTimeDisplay = (currentTime) => {
		setPlayer((currPlayer) => ({
			...currPlayer,
			currentTime: currentTime,
		}));
	}

	const updatePlayerProgressBar = (currentTime, duration) => {
		setPlayer((currPlayer) => ({
			...currPlayer,
			progressBar: (currentTime / duration) * 100
		}))
	}

	const handlePlayerShortcuts = (event) => {
		if(event.key === ' ' || event.key.toLowerCase() === 'k') {
			if(player.status === 'playing') {
				player.playerHandler.pauseVideo();
			} else if(player.status === 'paused') {
				player.playerHandler.playVideo();
			}
		}

		if(event.key === 'ArrowRight' || event.key.toLowerCase() === 'l') {
			player.playerHandler.seekTo(player.currentTime + 10);
		}

		if(event.key === 'ArrowLeft' || event.key.toLowerCase() === 'j') {
			player.playerHandler.seekTo(player.currentTime - 10);
		}

		if(event.key.toLowerCase() === 'i') {
			setPlayer({ ...player, showYtIframe: !player.showYtIframe });
		}

		if(event.key.toLowerCase() === 'm') {
			playNextTrack();
		}
		
		if(event.key.toLowerCase() === 'n') {
			playPrevTrack();
		}
		
	}

	const handleProgressBarMouseMove = (event) => {
		if(event.buttons === 1) {
			setPlayer((currPlayer) => ({ 
				...currPlayer, 
				currentTime: (event.target.value / 100) * currPlayer.playerHandler.getDuration(),
			}));
		}
	}

	const handleProgressBarMouseDown = (event) => {
		console.log('progressbar down');
		let timeInterval = player.currentTimeIntervalHandle;
		let progressBarInterval = player.progressBarIntervalHandle;

		if(timeInterval !== null) {
			clearInterval(timeInterval);
			timeInterval = null;
		}

		if(progressBarInterval !== null) {
			clearInterval(progressBarInterval);
			progressBarInterval = null;
		}

		setPlayer({ 
			...player, 
			currentTimeIntervalHandle: timeInterval, 
			progressBarIntervalHandle: progressBarInterval 
		});
	}

	const handleProgressBarMouseUp = (event) => {
		console.log('progressbar up');
		let timeInterval = player.currentTimeIntervalHandle;
		let progressBarInterval = player.progressBarIntervalHandle;

		player.playerHandler.seekTo(player.currentTime);
		if(timeInterval === null) {
			timeInterval = setInterval(() => { 
				updatePlayerTimeDisplay(player.playerHandler.getCurrentTime());
			}, 200);

			console.log((selectedList.selectedSong) && getResourceId(selectedList.selectedSong), 'timeInterval:', timeInterval);
		}

		if(progressBarInterval === null) {
			progressBarInterval = setInterval(() => { 
				updatePlayerProgressBar(player.playerHandler.getCurrentTime(), player.playerHandler.getDuration()); 
			}, 200);

			console.log((selectedList.selectedSong) && getResourceId(selectedList.selectedSong), 'progressBarInterval:', progressBarInterval);
		}

		setPlayer({ 
			...player, 
			duration: player.playerHandler.getDuration(),
			currentTimeIntervalHandle: timeInterval,
			progressBarIntervalHandle: progressBarInterval,
		});
	}

	const onPlayerReady = (event) => {
		setPlayer((currPlayer) => ({ 
			...currPlayer, 
			playerHandler: event.target,
		}));
	};

	const onSongEnd = (event) => {
		console.log('repeat:', player.repeat);
		if(player.repeat === 'none') return; 
		if(player.repeat === 'song') {
			player.playerHandler.seekTo(0);
			return;
		}

		handlePlayNextSong();
	}

	const onPlayerStateChange = (event) => {
		let code = event.data;
		let status;

		switch(code) {
			case 0:
				status = 'finished';
				break;
			case 1:
				status = 'playing';
				break;
			case 2:
				status = 'paused';
				break;
			case 3:
				status = 'loading';
				break;
			default:
				status = 'empty';
		}
		setPlayer((currPlayer) => ({ ...currPlayer, status }));
	}
	
  return (
    <div 
			className='
				w-full h-[10vh]
			bg-dark-secondary text-light
				flex justify-between items-center
				px-3 relative' 	
		>
			<div id='player-controls' className='flex'>
				<div className='hover:cursor-pointer pr-2'>
					<MdSkipPrevious 
					 	className={``}
						onClick={ playPrevTrack } 
					/>
				</div>
				<div className='hover:cursor-pointer pr-2'>
					{
						player.status === 'playing' ?
							<FaPause onClick={ () => { 
								player.playerHandler.pauseVideo();
							}} /> :
							<FaPlay onClick={ () => {
								player.playerHandler.playVideo();
							}} /> 
					}
				</div>
				<div className='hover:cursor-pointer pr-2'>
					<MdSkipNext onClick={ playNextTrack } />
				</div>
				<div className='hover:cursor-pointer'>
					{
						player.repeat === 'none' ?
							<MdRepeat onClick={ () => setPlayer({ ...player, repeat: 'song' }) } /> :
							player.repeat === 'song' ?
								<MdOutlineRepeatOne className='text-blue-600' onClick={ () => setPlayer({ ...player, repeat: 'playlist' }) } /> :
								<MdRepeat className='text-blue-600' onClick={ () => setPlayer({ ...player, repeat: 'none' }) } />
					}
				</div>
			</div>

			<div className='flex'>
				<p className='p-2'>{ formatSecondsToTime(player.currentTime) }</p>
				<input 
					type='range' 
					name='player-progress-bar' 
					id='player-progress-bar' 
					className='w-[300px]'
					value={ player.progressBar }
					onMouseDown={ handleProgressBarMouseDown }
					onMouseUp={ handleProgressBarMouseUp } 
					onMouseMove={ handleProgressBarMouseMove }
					onChange={ (event) => { setPlayer({...player, progressBar: event.target.value}) } }
				/>
				<p className='p-2'>{ formatSecondsToTime(player.duration) }</p>
			</div>

			<div className='relative overflow-visible' 
				onMouseEnter={ () => { setPlayer({ ...player, showVolumeControl: true }) } } 
				onMouseLeave={ () => { setPlayer({ ...player, showVolumeControl: false }) } }
			>
				<div className={ `
					absolute 
					w-6 h-32 bottom-4 -left-1 
					bg-slate-500
					${ player.showVolumeControl ? '' : 'hidden' }
				`}>
					<input 
						type='range' 
						className='absolute -rotate-90 w-[100px] bottom-[40%] -left-[38px]' 
						value={ player.volume }
						onChange={ (event) => { setPlayer({ ...player, volume: event.target.value }) } }
					/>
				</div>
				{
					player.volume < 1 ? 
						<FaVolumeMute /> :
						player.volume <= 50 ?
							<FaVolumeDown /> :
							<FaVolumeUp />
				}
			</div>

			{
				playingTrackIndex !== -1 &&
				<div 
					className='flex hover:cursor-pointer' 
					onClick={ 
						() => setPlayer({ ...player, showYtIframe: !player.showYtIframe })
					}
				>
					<div className='text-xs text-right'>
						<p>{ queuedTracks[playingTrackIndex].title }</p>
						<p>{ queuedTracks[playingTrackIndex].author }</p>
					</div>

					<div 
						style={{ backgroundImage: `url(${ queuedTracks[playingTrackIndex].thumbnail })` }} 
						className='ml-2 h-8 w-8 bg-[length:190%] bg-center bg-no-repeat rounded-md' 
					></div>
				</div>
			}
			
			{
				playingTrackIndex !== -1 &&
				<YouTube 
					videoId={ queuedTracks[playingTrackIndex].youtubeId } 
					opts={{ height: '390', width: '640', playerVars: { autoplay: 1 } }} 
					className={`absolute right-0 bottom-20 ${ (player.showYtIframe) ? '' : 'hidden' }`}
					onReady={ onPlayerReady }
					onStateChange={ onPlayerStateChange }
					onEnd={ onSongEnd }
				/>
			}
    </div>
  );
};

export default ContentPlayer;