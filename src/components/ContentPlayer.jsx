import { useContext, useState, useEffect, useRef } from 'react';
import { FaPause, FaPlay } from 'react-icons/fa';

import { getResourceId } from '../utils/getResourceId';
import { ContentViewerContext } from '../context/ContentViewerContext';

const loadContent = (id, retrievePlayer) => {
	let player = null;

	const onYouTubeIframeAPIReady = _ => {
		player = new YT.Player('player', {
			height: '390',
			width: '640',
			videoId: id,
			playerVars: {
				'playsinline': 1
			},
			events: {
				'onReady': onPlayerReady,
			}
		});

		player.i.classList.add('absolute');
		player.i.classList.add('right-0');
		player.i.classList.add('bottom-10');
		player.i.classList.add('hidden');
	}

	const onPlayerReady = (event) => {
		event.target.playVideo();
		retrievePlayer(event.target);

		updateTimeDisplay(event.target);
		updateProgressBar(event.target);

		setInterval(() => {
			updateTimeDisplay(player);
		}, 1000);

		setInterval(() => {
			updateProgressBar(event.target);
		}, 1000);
	}

	onYouTubeIframeAPIReady();
};

const unloadContent = (player) => {
	player.destroy();
};

const updateTimeDisplay = (player) => {
	document.getElementById('player-current-time').innerText = formatTime(player.getCurrentTime());
	document.getElementById('player-duration').innerText = formatTime(player.getDuration());
}

const updateProgressBar = (player) => {
	document.getElementById('player-progress-bar').value = (player.getCurrentTime() / player.getDuration()) * 100;
}

const selectProgressBarTimer = (event, player) => {
	let newTime = player.getDuration() * (event.target.value / 100);
	player.seekTo(newTime);
}

const formatTime = (time) => {
	time = Math.round(time);
	let minutes = Math.floor(time / 60);
	let seconds = time - minutes * 60;
	seconds = seconds < 10 ? '0' + seconds : seconds;

	return minutes + ':' + seconds;
}

const ContentPlayer = () => {
	const { selectedList } = useContext(ContentViewerContext);
	const [ player, setPlayer ] = useState(null);
  const [ playing, setPlaying ] = useState(false);
	const [ showYTPlayer, setShowYTPlayer ] = useState(false);
	const firstLoad = useRef(true);

	const retrievePlayer = (player) => {
		setPlayer(_ => player);
	}

  useEffect(() => {
		const id = getResourceId(selectedList.selectedSong);	
		if(firstLoad.current) {
			loadContent(id, retrievePlayer);
			firstLoad.current = false;

			return;
		}

		if(player) {
			player.loadVideoById(id, 0);
			setPlaying(true);
		}

    return () => {
      // unloadContent(player);
    };
  }, [selectedList.selectedSong]);

	useEffect(() => {
		setPlaying(player !== null);

		return () => {
			setPlaying(false);
		}
	}, [player]);

	useEffect(() => {
		if(!player) return;

		if(!showYTPlayer) {
			player.getIframe().classList.add('hidden');
		} else {
			player.getIframe().classList.remove('hidden');
		}

	}, [showYTPlayer]);


  return (
    <div className='
			w-full h-10 
		bg-white text-black 
			flex justify-between items-center 
			px-3 relative' 	
		>
			<div className='hover:cursor-pointer'>
				{
					playing ? 
						<FaPause onClick={ 
							() => { player.pauseVideo(); setPlaying(false); } 
						} /> : 
						<FaPlay onClick={ 
							() => { player.playVideo(); setPlaying(true); } 
						} />
				}
			</div>

			<div className='flex w-2/3'>
				<p id='player-current-time' className='p-2'></p>
				<input 
					type='range' 
					name='player-progress-bar' 
					id='player-progress-bar' 
					className='w-full'
					onMouseUp={ (event) => selectProgressBarTimer(event, player) } 
				/>
				<p id='player-duration' className='p-2'></p>
			</div>

			<div 
				className='flex hover:cursor-pointer' 
				onClick={ 
					() => setShowYTPlayer((currShowYTPlayer) => !currShowYTPlayer)
				}
			>
				<img 
					src={ selectedList.selectedSong.snippet.thumbnails.high.url } 
					className='h-8 mr-8' 
				/>

				<div className='flex flex-col text-xs'>
					<p>{ selectedList.selectedSong.snippet.title }</p>
					<p>{ selectedList.selectedSong.snippet.channelTitle }</p>
				</div>
			</div>

			
			<div id={`player`} ></div>
    </div>
  );
}

export default ContentPlayer;