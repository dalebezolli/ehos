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
	console.log(message);
	return { code: error.code, message };
}

export const searchData = async (query) => {
	const data = await fetch(
		`${YOUTUBE_API_URL}/search?q=${query}&key=${import.meta.env.VITE_YOUTUBE_API_KEY}&part=snippet`, 
		requestSettings
	);
	const response = await data.json();

	if(response.error) throw generateError(response.error);
	return response;
};

export const searchPlaylist = async (playlistId) => {
	const data = await fetch(
		`${YOUTUBE_API_URL}/playlistItems?playlistId=${ playlistId }&key=${import.meta.env.VITE_YOUTUBE_API_KEY}&part=snippet`, 
		requestSettings
	);
	const response = await data.json();

	if(response.error) throw generateError(response.error);
	return response;
}