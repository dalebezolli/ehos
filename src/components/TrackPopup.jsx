import { useEffect } from 'react';
import { createContext, useContext, useState, useRef } from 'react';
import { useUser } from '../context/UserContext';
import { getUserTags, saveTrackToCollection } from '../utils/firebase';

const TrackPopup = ({ track, onSave, onCancel }) => {
	const { user } = useUser();

	const [ tags, setTags ] = useState(null);
	const [ saving, setSaving ] = useState(false);
	const genreSelectionRef = useRef();

	useEffect(() => {
		const loadTags = async () => {
			const tags = await getUserTags(user.uid);
			setTags(tags[0]);
		};

		if(!tags) loadTags();
	}, [track]);

	return (
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
					onClick={ async () => {
						const genre = genreSelectionRef.current.value;
						const newTrack = { ...track, tags: genre === 'empty' ? [] : [genre] };
						
						setSaving(true);
						await saveTrackToCollection(
							newTrack, user.uid, 
							() => { 
								console.log('saved!'); 
								onSave && onSave(newTrack); 
								onCancel(); 
							}, 
							() => console.log('exists.'), 
							(err) => console.log(err)
						);
						setSaving(false);
					} }
					disabled={saving}
				>Save</button>
				<button 
					className='bg-black text-light hover:bg-primary' 
					onClick={ () => onCancel() } 
				>Cancel</button>
			</div>
		</div>
	)
}

export default TrackPopup;