import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { searchData, searchPlaylist } from '../utils/api';
import TrackList from '../components/TrackList';
import { convertYoutubeEntryToEhosEntry } from '../utils/helpers';

const Search = _ => {
	const { searchQuery } = useParams();
	const [ resultList, setResultList ] = useState([]);
	const [ error, setError ] = useState(null);

	useEffect(() => {
		const search = async (query, searchType) => {
			console.log(query, searchType);
			let response;
			try {
				response = await (
					(searchType === 'searchVideos' ) ? 
						searchData(query) : 
						searchPlaylist(query.slice(query.indexOf('=') + 1))
				);   
				console.log('test');
			} catch(e) {
				setError(e);
				return;
			}

			const data = response.items.reduce((tracks, ytTrack) => {
				tracks.push(convertYoutubeEntryToEhosEntry(ytTrack));
				return tracks;
			}, []);
			setResultList(data);
		}

		let searchType = 'searchVideos';
		if(searchQuery.includes('/playlist?list=')) {
			searchType = 'searchPlaylist';
		}
		search(searchQuery, searchType);

	}, [searchQuery]);

	return (
		<div className='px-16 container'>
			<TrackList tracks={ resultList } />
		</div>
	);
};

export default Search;