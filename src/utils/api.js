/**
 * Fetch usage directly to third party api's is a temporary fix. 
 * All these will be changed to talk with our api server once it's ready.
 */

const requestSettings = {
	method: 'GET',
	redirect: 'follow',
}

const YOUTUBE_API_URL = 'https://youtube.googleapis.com/youtube/v3';

const generateError = (error) => {
	let message = (error.code === 404) ? 'Request couldn\'t be found' : 'Internal error';
	return { code: error.code, message };
}

export const searchData = async (query, opts) => {
	let size = opts && opts.size ? opts.size || 25 : 25;
	let page = opts && opts.page ? opts.page || null : null;

	const data = await fetch(
		YOUTUBE_API_URL + 
		'/search' +
		'?q=' + query +
		'&key=' + import.meta.env.VITE_YOUTUBE_API_KEY +
		'&part=snippet' +
		'&maxResults=' + size +
		(page ? '&pageToken=' + page : '' ),
		requestSettings
	);
	const response = await data.json();

	if(response.error) throw generateError(response.error);
	return response;
};

export const searchPlaylist = async (playlistId, opts) => {
	let size = opts && opts.size ? opts.size || 25 : 25;
	let page = opts && opts.page ? opts.page || 25 : null;

	const data = await fetch(
		YOUTUBE_API_URL + 
		'/playlistItems' +
		'?playlistId=' + playlistId +
		'&key=' + import.meta.env.VITE_YOUTUBE_API_KEY +
		'&part=snippet' +
		'&maxResults=' + size +
		(page ? '&pageToken=' + page : '' ),
		requestSettings
	);
	const response = await data.json();

	if(response.error) throw generateError(response.error);
	return response;
}