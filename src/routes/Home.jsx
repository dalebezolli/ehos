import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { query, where } from 'firebase/firestore';
import { songsCollection, getSongs } from '../utils/firebase';

const Home = _ => {
	const { user } = useAuth();
	const [ savedSongs, setSavedSongs ] = useState([]);

	useEffect(() => {
		const getUserSavedSongs = async () => {
			await getSongs(
				query(songsCollection, where('userId', '==', user.uid)),
				(songs) => { setSavedSongs(songs.docs.map(song => song.data())); }
			);
		}

		getUserSavedSongs();
	});

	return (
		<div className='flex flex-col items-center'>
			<h1 className='text-3xl font-bold mb-3'>Welcome to Ehos{ user && `, ${ user.displayName }` } </h1>
					
			<button onClick={ () => setList(list.insertFront('a')) }>Insert</button>

			{/* {
				!user ?
					<p>Search to get started 🎶</p> : (
						<div>
							<p>Saved Songs</p>
							{ 
								savedSongs.map(song =>
									<div key={ song.youtubeId } className='flex justify-between w-screen'>
										<p>{ song.title }</p>	
										<p>{ song.author }</p>
										<p>{ song.length }</p>
									</div>
								)
							}
						</div>
					)
			} */}
		</div>
	);
};

export default Home;