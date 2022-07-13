// TODO: Change this once rest api is built as it will be redundant
export const getResourceId = (resource) => {
	let id = '';
	try {
		id = resource.snippet.resourceId.videoId;
	} catch {
		id = resource.id.videoId;
	}

  return id;
}