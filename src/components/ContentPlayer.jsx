import YouTube from 'react-youtube';
import { useState, useContext, useEffect } from 'react';
import { ContentViewerContext } from '../context/ContentViewerContext';

import { getResourceId, formatSecondsToTime } from '../utils/helpers';
import { decode } from 'he';

import { FaPause, FaPlay } from 'react-icons/fa';
import { MdRepeat, MdOutlineRepeatOne } from 'react-icons/md';

const ContentPlayer = _ => {
	const { selectedList, selectSong } = useContext(ContentViewerContext);
	const [ player, setPlayer ] = useState({ 
		status: 'empty',
		repeat: 'none',
		playerHandler: null,
		currentTime: 0,
		currentTimeIntervalHandle: null,
		progressBar: 0,
		progressBarIntervalHandle: null,
		duration: 0,
		showYtIframe: false,
	});
	
	useEffect(_ => {
		console.log((selectedList.selectedSong) && getResourceId(selectedList.selectedSong), 'status:', player.status, player.playerHandler && player.playerHandler.getPlayerState());
		if(player.status === 'playing') {
			let timeInterval = player.currentTimeIntervalHandle;
			let progressBarInterval = player.progressBarIntervalHandle;

			console.log((selectedList.selectedSong) && getResourceId(selectedList.selectedSong), 'playing', timeInterval, progressBarInterval);
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

		if(player.status === 'empty' && player.currentTimeIntervalHandle !== null) {
			let currentTimeIntervalHandle = player.currentTimeIntervalHandle;
			let progressBarIntervalHandle = player.progressBarIntervalHandle;

			console.log((selectedList.selectedSong) && getResourceId(selectedList.selectedSong), 'cleanup...', player.currentTimeIntervalHandle, player.progressBarIntervalHandle);
			if(player.currentTimeIntervalHandle !== null) {
				console.log((selectedList.selectedSong) && getResourceId(selectedList.selectedSong), 'cleanup timeInterval:', currentTimeIntervalHandle);
				clearInterval(player.currentTimeIntervalHandle);
				currentTimeIntervalHandle = null;
			}

			if(player.progressBarIntervalHandle !== null) {
				console.log((selectedList.selectedSong) && getResourceId(selectedList.selectedSong), 'cleanup progressBarInterval:', progressBarIntervalHandle);
				clearInterval(player.progressBarIntervalHandle);
				progressBarIntervalHandle = null;
			}
			setPlayer({ ...player, currentTimeIntervalHandle, progressBarIntervalHandle });
		}

	}, [player.status]);

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

		let currentSongIndex = selectedList.entries.findIndex((song) => {
			return song === selectedList.selectedSong; 
		})
		let nextSong = selectedList.entries[currentSongIndex + 1];
		selectSong(nextSong);
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
				w-full h-10 
			bg-white text-black 
				flex justify-between items-center
				px-3 relative' 	
		>
			<div id='player-controls' className='flex'>
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
				<div className='hover:cursor-pointer'>
					{
						player.repeat === 'none' ?
							<MdRepeat onClick={ () => setPlayer({ ...player, repeat: 'song' }) } /> :
							player.repeat === 'song' ?
								<MdRepeat className='text-blue-600' onClick={ () => setPlayer({ ...player, repeat: 'playlist' }) } /> :
								<MdOutlineRepeatOne className='text-blue-600' onClick={ () => setPlayer({ ...player, repeat: 'none' }) } />
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

			{
				selectedList.selectedSong &&
				<div 
					className='flex hover:cursor-pointer' 
					onClick={ 
						() => setPlayer({ ...player, showYtIframe: !player.showYtIframe })
					}
				>
					<img 
						src={ selectedList.selectedSong.snippet.thumbnails.high.url } 
						className='h-8 mr-8' 
					/>

					<div className='flex flex-col text-xs'>
						<p>{ decode(selectedList.selectedSong.snippet.title) }</p>
						<p>{ decode(selectedList.selectedSong.snippet.channelTitle) }</p>
					</div>
				</div>
			}
			
			{
				selectedList.selectedSong &&
				<YouTube 
					videoId={ getResourceId(selectedList.selectedSong) } 
					opts={{ height: '390', width: '640', playerVars: { autoplay: 1 } }} 
					className={`absolute right-0 bottom-10 ${ (player.showYtIframe) ? '' : 'hidden' }`}
					onReady={ onPlayerReady }
					onStateChange={ onPlayerStateChange }
					onEnd={ onSongEnd }
				/>
			}
    </div>
  );
};

export default ContentPlayer;