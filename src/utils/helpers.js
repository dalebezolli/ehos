export const getResourceId = (resource) => {
	let id = '';
	try {
		id = resource.snippet.resourceId.videoId;
	} catch {
		id = resource.id.videoId;
	}

  return id;
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