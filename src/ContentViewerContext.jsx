import { searchData, searchPlaylist } from './api';
import { createContext, useState } from 'react';

export const ContentViewerContext = createContext();

function ContentViewerProvider({ children }) {
  const [ selectedList, setSelectedList ] = useState({
    entries: [],
    entriesType: 'video',
    pageInfo: {},
  });

  const parseResponse = (res) => {
    const parsedResponse = {...selectedList};   
    parsedResponse.entries = res.items;
    parsedResponse.pageInfo = res.pageInfo;
    // parsedResponse.pageInfo.prevPageToken;
    // parsedResponse.pageInfo.nextPageToken;

    return parsedResponse;
  };

  const searchContent = async (query) => {
    let queryType = 'search';
    if(query.includes('/playlist?list=')) {
      queryType = 'searchPlaylist';
    };

    const response = await (
      (queryType === 'search' ) ? 
        searchData(query) : 
        searchPlaylist(query.slice(query.indexOf('=') + 1))
    );   

    const parsedResponse = parseResponse(response);
    parsedResponse.entriesType = queryType;

    setSelectedList(parsedResponse);
  };

	return (
    <ContentViewerContext.Provider value={{
      selectedList,
      searchContent,
    }}>
      { children }
    </ContentViewerContext.Provider>
	);
}

export default ContentViewerProvider;