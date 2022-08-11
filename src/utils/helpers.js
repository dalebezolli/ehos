export const getResourceId = (resource) => {
	let id = '';
	try {
		id = resource.snippet.resourceId.videoId;
	} catch {
		id = resource.id.videoId;
	}

  return id;
}

export const convertYoutubeEntryToEhosEntry = (ytSongEntry) => {
	if(ytSongEntry.snippet.title === 'Deleted video' || ytSongEntry.snippet.title === 'Private video') return;

	// TODO: Parse Title & Author for better readability

	// TODO: Get song's length
	const data = {
		title: ytSongEntry.snippet.title,
		author: ytSongEntry.snippet.videoOwnerChannelTitle || ytSongEntry.snippet.channelTitle,
		length: 0,
		youtubeId: getResourceId(ytSongEntry),
		tags: [],
		thumbnail: ytSongEntry.snippet.thumbnails.high?.url || ytSongEntry.snippet.thumbnails.medium?.url || ytSongEntry.snippet.thumbnails.default.url,
	}

	return data;
}

export const formatSecondsToTime = (time) => {
	time = Math.round(time);
	let minutes = Math.floor(time / 60);
	let seconds = time - minutes * 60;
	seconds = seconds < 10 ? '0' + seconds : seconds;

	return minutes + ':' + seconds;	
}

export const isInViewport = (element) => {
	const rect = element.getBoundingClientRect();
	return (
		rect.top >= 0 &&
		rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
	);
};