import { useState, useEffect, useRef } from 'react';
import { useUser } from '../context/UserContext';
import { getTracksFromCollection, getUserTags } from '../utils/firebase';
import TrackList from '../components/TrackList';
import { FaSearch } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';


const Home = _ => {
	const { user, signin } = useUser();
	const [ savedSongs, setSavedSongs ] = useState([]);
	const filterRef = useRef();
	let [ filteredSongs, setFilteredSongs ] = useState(savedSongs);

	const navigate = useNavigate();
	const location = useLocation();

	let from = location.state ? location.state.from : null;
	let path = from ? from.pathname + from.search : '/';

	const handleLogin = (event) => {
		signin(() => { navigate(path, { replace: true }) });
	}

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
	}, [user]);

	const filterSavedSongs = async (filter) => {
		let treeSearch = true;	

		if(filter.charAt(0) === '*') {
			treeSearch = false;
			filter = filter.slice(1);
		}	

		const findTagChildren = (filterTag, tags) => {
			let children = [];		

			for(let tag of tags) {
				if(tag.parent === filterTag) {
					children = [...children, tag.name];
					children = [...children, ...findTagChildren(tag.name, tags)];
				}
			}
			return children;
		};	

		let children;
		if(treeSearch) {
			const userTags = await getUserTags(user.uid);
			const genreTags = userTags[0].nodes;
			children = [filter , ...findTagChildren(filter, genreTags)];
		} else {
			children = [filter];
		}
		
		setFilteredSongs(savedSongs.filter((song) =>
			children.includes(song.tags[0])
		));
	};

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

	if(!user) return (
		<div className='container mx-auto flex flex-col items-center'>
			<h2 className='text-3xl mt-24 mb-20'>Welcome to EHOS</h2>
			<button 
				className='bg-primary rounded-sm px-8 py-2' 
				onClick={ handleLogin }
			>
					Login with google
			</button>
		</div>
	);

	return (
		<div className='flex flex-col px-16 container mx-auto'>

			<div>
				<div className='flex justify-between items-center'>
					<p className='text-2xl'>Saved Tracks</p>

					<form className='
						flex p-2 bg-dark-secondary 
					focus-within:bg-input-focus rounded-3xl 
						transition-all
						w-[200px] focus-within:w-[350px]'
						onSubmit={ (event) => {
							event.preventDefault();
							if(!filterRef.current.value) {
								setFilteredSongs(savedSongs);
								return;
							}

							filterSavedSongs(filterRef.current.value);
						}}
					>
						<button 
							type='submit'
        			className='
								pl-2 pr-4 
								text-light-secondary hover:text-light transition-colors' 
						>
							<FaSearch className='w-3' />
						</button>
						<input 
							type='text' 
							id='filter' 
							placeholder='Filter tracks'
							className='
								bg-inherit 
								text-sm
								text-light placeholder-light-secondary 
								outline-none
								transition-all w-full' 
							ref={ filterRef } 
						/>
					</form>
				</div>

				<div className='w-full h-[2px] my-3 bg-[#FFFFFF10]'></div>
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
	);
};

export default Home;