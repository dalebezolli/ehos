import { useEffect } from 'react';
import { createContext, useContext, useState, useRef } from 'react';
import { useUser } from '../context/UserContext';
import { getUserTags, saveTrackToCollection } from '../utils/firebase';

const TrackPopup = ({ track, onSave, onCancel }) => {
	const { user } = useUser();

	const [ tags, setTags ] = useState(null);
	const [ saving, setSaving ] = useState(false);
	const [ selected, setSelected ] = useState(null);
	const genreSelectionRef = useRef();

	useEffect(() => {
		const loadTags = async () => {
			const tags = await getUserTags(user.uid);
			setTags(tags[0]);
		};

		if(!tags) loadTags();
		setSelected(track.tags[0]);
	}, [track]);

	return (
		<div className='fixed w-screen h-screen top-0 left-0 bg-[#000000af] z-[100]'>
			<div className='
				absolute w-[300px] rounded-lg
				bg-dark-secondary top-1/2 left-1/2
				-translate-y-1/2 -translate-x-1/2
				text-light
			'>
				<div className='flex justify-between px-[18px] py-4'>
					<p>Save Track</p>
					<button className='text-sm' onClick={ () => onCancel() } >Exit</button>
				</div>

				<div className='bg-[#FFFFFF10] w-full h-[1px]'></div>
				<div className='w-full px-[18px] pb-4 text-sm max-h-[300px] overflow-y-scroll'>
					{ 
						tags?.nodes && tags.nodes.map((tag) =>
							<div 
								className='flex pt-4 items-center cursor-pointer' 
								data-tag={ tag.name } 
								key={ tag.name }
								disabled={ saving }
								onClick={ async (event) => {
									let genre = event.currentTarget.dataset.tag;
									if(genre === track.tags[0]) genre = null;
									const newTrack = { ...track, tags: [genre] };

									setSaving(true);
									setSelected(tag.name);
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
								}}
							>
								<div className={`w-5 h-5 mr-4 ${ selected === tag.name ? 'bg-primary' : 'border-2 border-light' } transition-all`}></div>
								<p>{ tag.name }{ tag.parent ? ` (${ tag.parent })` : '' }</p>
							</div>
						)
					}
				</div>

				<button 
					className='text-light text-sm px-[18px] py-4' 
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
			</div>

		</div>
	)
}

export default TrackPopup;