import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

import { searchData, searchPlaylist } from '../utils/api';
import TrackList from '../components/TrackList';
import { convertYoutubeEntryToEhosEntry } from '../utils/helpers';

const Search = _ => {
	var loaderRef = useRef();
	const { searchQuery } = useParams();
	const [ shouldLoadMore, setShouldLoadMore ] = useState(false);
	const [ resultList, setResultList ] = useState([]);
	const [ nextPageToken, setNextPageToken ] = useState(null);
	const [ error, setError ] = useState(null);

	const getTracks = async (query, searchType, pageToken = null) => {
		let response;
		try {
			response = await (
				(searchType === 'searchVideos' ) ? 
					searchData(query, { page: pageToken }) : 
					searchPlaylist(query.slice(query.indexOf('=') + 1), { page: pageToken })
			);   
		} catch(e) {
			setError(e);
			return [];
		}

		setNextPageToken(response.nextPageToken);
		const data = response.items.reduce((tracks, ytTrack) => {
			tracks.push(convertYoutubeEntryToEhosEntry(ytTrack));
			return tracks;
		}, []);

		return data;
	}

	useEffect(() => {
		const search = async (query, searchType) => {
			const data = await getTracks(query, searchType);
			setResultList(data);
		}

		let searchType = 'searchVideos';
		if(searchQuery.includes('/playlist?list=')) {
			searchType = 'searchPlaylist';
		}
		search(searchQuery, searchType);

	}, [searchQuery]);

	useEffect(() => {
		const loadMore = async () => {

			let searchType = 'searchVideos';
			if(searchQuery.includes('/playlist?list=')) {
				searchType = 'searchPlaylist';
			}

			const data = await getTracks(searchQuery, searchType, nextPageToken);
			setResultList([...resultList, ...data]);
		}

		if(shouldLoadMore) loadMore();

	}, [shouldLoadMore]);

	useEffect(() => {
		const observer = new IntersectionObserver((entries) => {
			if(entries[0].isIntersecting) setShouldLoadMore(true);
			else setShouldLoadMore(false);
		});
		if(loaderRef.current && resultList.length !== 0) observer.observe(loaderRef.current);

		return () => {
			if(loaderRef.current) observer.unobserve(loaderRef.current);
		}
	}, [loaderRef, resultList]);

	if(error) {
		return (
			<p>Oops, an error occured!</p>
		);
	}

	return (
		<div className='px-16 container mx-auto'>
			<div>
				<p className='text-2xl'>Results</p>
				<div className='w-full h-[2px] my-3 bg-[#FFFFFF10]'></div>
			</div>

			<TrackList tracks={ resultList } />
			<div id='loader' ref={ loaderRef }>loading...</div>
		</div>
	);
};

export default Search;