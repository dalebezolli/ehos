import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTracksFromCollection } from '../utils/firebase';
import TrackList from '../components/TrackList';


const Home = _ => {
	const { user } = useAuth();
	const [ savedSongs, setSavedSongs ] = useState([]);

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
							<p>Saved Songs</p>
							<TrackList 
								tracks={ savedSongs } 
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