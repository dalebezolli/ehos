import { useEffect } from 'react';
import { createContext, useContext, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserTags, saveTrackToCollection } from '../utils/firebase';

const TrackPopupContext = createContext();

export const useTrackPopup = () => {
	return useContext(TrackPopupContext);
}

const TrackPopup = ({children}) => {
	const { user } = useAuth();

	const [ tags, setTags ] = useState(null);
	const [ track, setTrack ] = useState(null);
	const [ onSave, setOnSave ] = useState(null);
	const genreSelectionRef = useRef();

	useEffect(() => {
		const loadTags = async () => {
			const tags = await getUserTags(user.uid);
			setTags(tags[0]);
		};

		if(!tags) loadTags();
	}, [track]);

	const displayTrack = (track, onSave) => {
		setTrack(track);
		setOnSave(() => (onSave));
	}

	const value = { displayTrack };

	return (
		<TrackPopupContext.Provider value={ value }>

		{
			track && (
				<div className='fixed w-screen h-screen top-0 left-0 z-100 bg-[#000000af] text-dark'>
					<div className='
						absolute max-w-[1000px] p-6
						bg-light-secondary top-1/2 left-1/2
						-translate-y-1/2 -translate-x-1/2
					'>
						<p className='font-bold'>{ track.title }</p>
						<p>TagEditor</p>

						<select name='genre' id='genre' ref={ genreSelectionRef } defaultValue={ track.tags[0] } >
							<option 
								key={ 'none' } 
								value={ 'empty' }
							>Select</option>
							{
								tags?.nodes && tags.nodes.map((tag) =>
									<option 
										key={ tag.name } 
										value={ tag.name }
									>{ tag.parent ? `${ tag.parent } ->` : '' }{ tag.name }</option>
								)
							}
						</select>

						<button 
							className='bg-black text-light hover:bg-primary' 
							onClick={ () => {
								const genre = genreSelectionRef.current.value;
								const newTrack = { ...track, tags: genre === 'empty' ? [] : [genre] };

								saveTrackToCollection(
									newTrack, user.uid, 
									() => { console.log('saved!'); onSave && onSave(newTrack); setTrack(null) }, 
									() => console.log('exists.'), 
									(err) => console.log(err)
								);
							} }
						>Save</button>
						<button 
							className='bg-black text-light hover:bg-primary' 
							onClick={ () => displayTrack(null) } 
						>Cancel</button>
					</div>
				</div>
			)
		}

			{ children }
		</TrackPopupContext.Provider>
	)
}

export default TrackPopup;