import { searchData, searchPlaylist } from '../utils/api';
import { createContext, useState } from 'react';

export const ContentViewerContext = createContext();

function ContentViewerProvider({ children }) {
  const [ selectedList, setSelectedList ] = useState({
    selectedSong: null,
    entries: [],
    entriesType: 'video',
    pageInfo: {},
  });
  const [error, setError] = useState(null);

  const parseResponse = (res, append) => {
    const parsedResponse = {...selectedList};   
    parsedResponse.entries = (!append) ? res.items : [...parsedResponse.entries, ...res.items];
    parsedResponse.pageInfo = res.pageInfo;
    if(parsedResponse.pageInfo) {
      parsedResponse.pageInfo.nextPageToken = res.nextPageToken || null;
      parsedResponse.pageInfo.prevPageToken = res.prevPageToken || null;
    }

    return parsedResponse;
  };

  const searchContent = async (query, opts) => {
	  let append = opts && opts.append ? opts.append || false : false;
	  let save = opts?.save !== undefined ? opts?.save : true ;

    let queryType = 'search';
    if(query.includes('/playlist?list=')) {
      queryType = 'searchPlaylist';
    };

    let response;
    try {
       response = await (
        (queryType === 'search' ) ? 
          searchData(query, opts) : 
          searchPlaylist(query.slice(query.indexOf('=') + 1), opts)
      );   
      setError(null);
    } catch(e) {
      setError(e);
      return;
    }

    const parsedResponse = parseResponse(response, (save ? append : false));
    parsedResponse.entriesType = queryType;
    console.log(`Response${ opts?.page ? ` ${opts.page}` : '' }:`, parsedResponse);

    if(save) {
      setSelectedList(parsedResponse);
    }
    return parsedResponse;
  };

  const selectSong = (selectedSong) => {
    setSelectedList({...selectedList, selectedSong});
  }

	return (
    <ContentViewerContext.Provider value={{
      selectedList,
      searchContent,
      selectSong,
      error,
    }}>
      { children }
    </ContentViewerContext.Provider>
	);
}

export default ContentViewerProvider;