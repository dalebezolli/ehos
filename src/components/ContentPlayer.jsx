import YouTube from 'react-youtube';
import { useState, useContext, useEffect } from 'react';
import { ContentViewerContext } from '../context/ContentViewerContext';

import { getResourceId, formatSecondsToTime } from '../utils/helpers';
import { decode } from 'he';

import { FaPause, FaPlay } from 'react-icons/fa';
import { MdSkipNext, MdSkipPrevious } from 'react-icons/md';

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
			progressBar: (currPlayer.currentTime * window.innerWidth) / currPlayer.duration
		}))
	}
	const handleProgressBarMouseMove = (event) => {
		if(event.buttons === 1) {
			setPlayer((currPlayer) => ({
				...currPlayer,
				currentTime: event.clientX * player.duration / window.innerWidth,
				progressBar: event.clientX,
			}))
		}
	}

	const handlePorgressBarMouseDown = (event) => {
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

	const handlePorgressBarMouseUp = (event) => {
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
		// TODO: repeat must have none, song and playlist
		if(player.repeat === 'none') {
			playNextTrack();
		} else {
			player.playerHandler.seekTo(0);
		}	
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

	if(playingTrackIndex === -1) return;
  return (
		<div className='fixed w-full bottom-0 select-none'>
			<div className='flex flex-col'>

				<div id='progress-bar' 
					className='h-[10px] flex items-end overflow-visible group cursor-pointer'
					onMouseMove={ handleProgressBarMouseMove }
					onMouseDown={ handlePorgressBarMouseDown }
					onMouseUp={ handlePorgressBarMouseUp }
				>
					<div 
						className='bg-[#474747] 
							h-[4px] w-full relative
							group-hover:h-[10px] transition-[height]'
					>
						<div 
							id='inner-porgress-bar' 
							className='h-[4px] bg-primary group-hover:h-[10px] transition-[height]' 
							style={{width: `${player.progressBar}px`}}
						></div>
						<div 
							className='absolute top-1/2 w-[10px] h-[10px]
								rounded-full bg-primary z-10 
								invisible -translate-y-1/2 -translate-x-1/2 
								transition-[width,height]
								hover:!w-[24px] hover:!h-[24px]
								group-hover:visible group-hover:w-[16px] group-hover:h-[16px]'
							style={{left: `${player.progressBar}px`}}
						></div>
					</div>
				</div>

				<div 
					className='
						w-full h-[10vh]
					bg-dark-secondary text-light
						px-3 relative flex' 	
				>

					<div className='w-1/3 flex items-center'>
						<p className='text-sm text-light-secondary pr-3'>
							{ formatSecondsToTime(player.currentTime) }
							/
							{ formatSecondsToTime(player.duration) }
						</p>

						<div className='pr-3 cursor-pointer'>
							<p 
								className={ `text-sm ${(player.repeat === 'song') ? 'text-light' : 'text-light-secondary'}` } 
								onClick={ () => { setPlayer({...player, repeat: (player.repeat !== 'song' ) ? 'song' : 'none' })} }>
									loop
							</p>
						</div>

						<div className='relative flex h-full items-center' 
							onMouseEnter={ () => { setPlayer({ ...player, showVolumeControl: true }) } } 
							onMouseLeave={ () => { setPlayer({ ...player, showVolumeControl: false }) } }
						>
							<p className='text-sm text-light-secondary pr-1'>volume</p>

							<div className={ `
								${ player.showVolumeControl ? '' : 'hidden' }
							`}>
								<input 
									type='range' 
									className='w-[100px]' 
									value={ player.volume }
									onChange={ (event) => { setPlayer({ ...player, volume: event.target.value }) } }
								/>
							</div>
						</div>

					</div>

					<div className='w-1/3 flex items-center justify-center'>
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
					</div>

					<div className='w-1/3 flex items-center justify-end'>
						<div 
							className='flex hover:cursor-pointer' 
							onClick={ 
								() => setPlayer({ ...player, showYtIframe: !player.showYtIframe })
							}
						>

							<div className='text-xs text-right'>
								<p>{ decode(queuedTracks[playingTrackIndex].title) }</p>
								<p className='text-light-secondary'>{ decode(queuedTracks[playingTrackIndex].author) }</p>
							</div>

							<div 
								style={{ backgroundImage: `url(${ queuedTracks[playingTrackIndex].thumbnail })` }} 
								className='ml-2 h-8 w-8 bg-[length:190%] bg-center bg-no-repeat rounded-md' 
							></div>
						</div>
					</div>

					<YouTube 
						videoId={ queuedTracks[playingTrackIndex].youtubeId } 
						opts={{ height: '390', width: '640', playerVars: { autoplay: 1 } }} 
						className={`absolute right-0 bottom-20 ${ (player.showYtIframe) ? '' : 'hidden' }`}
						onReady={ onPlayerReady }
						onStateChange={ onPlayerStateChange }
						onEnd={ onSongEnd }
					/>

				</div>
			</div>
		</div>
  );
};

export default ContentPlayer;