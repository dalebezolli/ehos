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
    // TODO: CHECK QUERY AND PARSE CORRECTLY IF IT'S A VIDEO OR A PLAYLIST   

    // TODO: SELECT CORRECT API REQUEST DEPENDING ON CONTENT TYPE
    const response = await searchData(query);   
    // TODO: SET RESULT TO SELECTED LIST
    const parsedResponse = parseResponse(response);
    parsedResponse.entriesType = 'video';

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