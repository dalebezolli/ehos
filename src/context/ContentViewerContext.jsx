import { createContext, useState, useContext } from 'react';

export const ContentViewerContext = createContext();
export const usePlayer = () => useContext(ContentViewerContext);

function ContentViewerProvider({ children }) {
  const [ selectedList, setSelectedList ] = useState({
    selectedSong: null,
    entries: [],
    entriesType: 'video',
    pageInfo: {},
  });

  const [error, setError] = useState(null);
  const [ queue, setQueue ] = useState({
    playingTrackIndex: -1,
    queuedTracks: [],
  });

  // QUEUE CONTROLS
  const playTrack = (track) => {
    setQueue((prevQueue) => ({
       playingTrackIndex: prevQueue.playingTrackIndex + 1,
       queuedTracks: [...prevQueue.queuedTracks, track], 
      }));
  };

  const queueTrack = (track) => {
    let playingTrackIndex = (queue.playingTrackIndex === -1) ? 0 : queue.playingTrackIndex;
    setQueue((prevQueue) => ({ 
      playingTrackIndex,
      queuedTracks: [...prevQueue.queuedTracks, track]
    }));
  };

  const dequeueTrack = (trackId) => {
    // TODO: Handle if last song or next doesnt exist
    setQueue((prevQueue) => ({
      ...prevQueue,
      queuedTracks: prevQueue.queuedTracks.reduce((prev, curr, currIndex) => {
        const tracks = currIndex !== trackId ? [...prev, curr] : prev;
        return tracks;
      }, [])
    }));
  };

  const playPrevTrack = () => {
    console.log('playing prev...');
    if(queue.playingTrackIndex === 0) return;
    console.log('prev.');

    setQueue((prevQueue) => ({
      ...prevQueue,
      playingTrackIndex: prevQueue.playingTrackIndex - 1,
    }))
  }

  const playNextTrack = () => {
    if(queue.queuedTracks.length - 1 === queue.playingTrackIndex) return;

    setQueue((prevQueue) => ({
      ...prevQueue,
      playingTrackIndex: prevQueue.playingTrackIndex + 1,
    }))
  }

  const value = { 
    queue, 
    playTrack, queueTrack, dequeueTrack, playPrevTrack, playNextTrack,
    selectedList 
  };

	return (
    <ContentViewerContext.Provider value={ value }>
      { children }
    </ContentViewerContext.Provider>
	);
}

export default ContentViewerProvider;