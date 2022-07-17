export const getResourceId = (resource) => {
	let id = '';
	try {
		id = resource.snippet.resourceId.videoId;
	} catch {
		id = resource.id.videoId;
	}

  return id;
}

export const isInViewport = (element) => {
	const rect = element.getBoundingClientRect();
	return (
		rect.top >= 0 &&
		rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
	);
};