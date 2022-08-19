import { useState, useEffect, useRef } from 'react';
import { useUser } from '../context/UserContext';
import { getTracksFromCollection } from '../utils/firebase';
import TrackList from '../components/TrackList';
import { usePopup } from './PageLayout';


const Home = _ => {
	const { user } = useUser();
	const [ savedSongs, setSavedSongs ] = useState([]);
	const filterRef = useRef();
	let [ filteredSongs, setFilteredSongs ] = useState(savedSongs);

	useEffect(() => {
		setFilteredSongs(savedSongs);
	}, [savedSongs]);

	useEffect(() => {
		const getUserSavedSongs = async () => {
			await getTracksFromCollection(
				user.uid,
				(songs) => { 
					setSavedSongs(songs.docs.map(song => song.data())); 
				},
				(err) => console.log(err)
			);
		}

		getUserSavedSongs();
	}, []);

	const handleUpdateCollectionTrack = (track) => {
		setSavedSongs((prevSavedSong) =>
			prevSavedSong.map((currTrack) => 
				(currTrack.youtubeId === track.youtubeId) ? track : currTrack
			)
		);
	}

	const handleDeleteCollectionTrack = (track) => {
		setSavedSongs((prevSavedSong) => prevSavedSong.filter((currTrack) => currTrack.youtubeId !== track.youtubeId));
	};

	return (
		<div className='flex flex-col px-16 container'>
			<h1 className='text-3xl font-bold mb-3'>Welcome to Ehos{ user && `, ${ user.displayName }` } </h1>
					
			{
				!user ?
					<p>Search to get started 🎶</p> : (
						<div>
							<p className='mb-8'>Saved Songs</p>

							<div>
								<input type='text' id='filter' className='text-dark' ref={ filterRef } />
								<button 
									className='px-2 bg-light-secondary text-dark'
									onClick={ () => {
										if(!filterRef.current.value) {
											setFilteredSongs(savedSongs);
											return;
										}

										setFilteredSongs(savedSongs.filter((song) => 
											song.tags[0] === filterRef.current.value
										))
									}
								}
								>Filter</button>
							</div>

							<TrackList 
								tracks={ filteredSongs } 
								enabledControls={{ save: true, queue: true, delete: true }} 
								controlHandlers={{ 
									onSave: handleUpdateCollectionTrack,
									onDelete: handleDeleteCollectionTrack 
								}} 
							/>
						</div>
					)
			}
		</div>
	);
};

export default Home;