import { createContext, useContext, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { saveTrackToCollection } from '../utils/firebase';

const TrackPopupContext = createContext();
const TagTree = [
	{ 
		name: 'edm',
		nodes: [ 
			{ name: 'dnb', nodes: [ { name: 'liquid', nodes: [] } ] },
			{ name: 'dubstep', nodes: [] },
		]
	},
	{
		name: 'rap',
		nodes: [
			{ name: 'trap', nodes: [] },
		]
	}
]

const generateTagSelectOptions = (track, tags, level) => {
	if(!tags) return;
	let options = [];

	tags.forEach((tag) => {
		const defaultValue = (track.tags[0] === tag.name) ? true : false;

		if(!tag.nodes.length) {
			options.push(
				<option 
					key={ tag.name } 
					value={ tag.name }
					defaultValue={ defaultValue }
				>{ tag.name }</option>
			);
		}
		else {
			console.log(`Create type: ${ tag.name }`);
			options.push(
			<option 
				key={ tag.name } 
				value={ tag.name }
				defaultValue={ defaultValue }
				className='font-bold'
			>{ tag.name }</option>
			);
			options.push(generateTagSelectOptions(track, tag.nodes, level + 1));
		}
	});

	return options;
}

export const useTrackPopup = () => {
	return useContext(TrackPopupContext);
}

const TrackPopup = ({children}) => {
	const { user } = useAuth();

	const [ track, setTrack ] = useState(null);
	const [ onSave, setOnSave ] = useState(null);
	const genreSelectionRef = useRef();

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
						<p>Tags</p>

						<select name='genre' id='genre' ref={ genreSelectionRef } >
							<option 
								key={ 'none' } 
								value={ 'empty' }
								defaultValue={ (track.tags[0]) ? false : true }
							>Select</option>
							{ generateTagSelectOptions(track, TagTree, 0) }
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