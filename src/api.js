/**
 * Fetch usage directly to third party api's is a temporary fix. 
 * All these will be changed to talk with our api server once it's ready.
 */

const requestSettings = {
	method: 'GET',
	redirect: 'follow',
}

const YOUTUBE_API_URL = 'https://youtube.googleapis.com/youtube/v3';

export const searchData = async (query) => {
	const data = await fetch(
		`${YOUTUBE_API_URL}/search?q=${query}&key=${import.meta.env.VITE_YOUTUBE_API_KEY}&part=snippet`, 
		requestSettings
	);
	const json = await data.json();
	return json;
};

export const searchPlaylist = async (playlistId) => {
	const data = await fetch(
		`${YOUTUBE_API_URL}/playlistItems?playlistId=${ playlistId }&key=${import.meta.env.VITE_YOUTUBE_API_KEY}&part=snippet`, 
		requestSettings
	);
	const json = await data.json();
	if(json.error) return null;
	return json;
}