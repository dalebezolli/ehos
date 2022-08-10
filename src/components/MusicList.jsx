import { useEffect, useContext, useRef, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

import { ContentViewerContext } from '../context/ContentViewerContext';
import { useAuth } from '../context/AuthContext';

import { getResourceId, convertYoutubeEntryToEhosEntry } from '../utils/helpers';
import { addSong, addSongs } from '../utils/firebase';
import { decode } from 'he';

import { FiPlus } from 'react-icons/fi';
import { FaTrash } from 'react-icons/fa';

const MusicList = () => {
  const { user } = useAuth();
  const { selectedList, selectSong, searchContent, error : searchError } = useContext(ContentViewerContext);
  const [ searchParams ] = useSearchParams();
  const [ loadMore, setLoadMore ] = useState(false);

  const handleSelect = (resourceId) => {
    const selectedResourceIndex = selectedList.entries.findIndex((item, index) => {
      const id = getResourceId(item);
      return id === resourceId;
    })   

    selectSong(selectedList.entries[selectedResourceIndex]);
  };

  const handleSavePlaylist = useCallback( async _ => {
    const getPlaylist = async _ => {
      let i = 0;
      let currItem = { ...selectedList };
      let list = [ ...selectedList.entries ];

      while(currItem.pageInfo.nextPageToken && i < 60) {
        
        console.log('search content...', i);
        if(i > 20) {
          console.log('reached max search');
        } else {
          currItem = await searchContent(
            searchParams.get('search'), 
            { append: true, page: currItem.pageInfo.nextPageToken, save: false }
          );
          list = [ ...list, ...currItem.entries ];
        }
        i++;
      }
      
      return list;
    };
    const list = await getPlaylist();
    console.log(list);

    addSongs(
      list.map(song => convertYoutubeEntryToEhosEntry(song)),
      user.uid, 
      (song) => { console.log(`Saved ${ song.title }`) },
      (song) => { console.log(`Exists ${ song.title }`) }
    ) 

  }, [selectedList.pageInfo]);

  useEffect(() => {
    searchContent(searchParams.get('search'));
  }, [searchParams.get('search')]);

  useEffect (() => {
    if(!selectedList.selectedSong) return;

    const selectedResourceIndex = selectedList.entries.findIndex((item, index) => {
      const id = getResourceId(item);
      return id === getResourceId(selectedList.selectedSong);
    })   

    if(selectedResourceIndex >= selectedList.entries.length - 5) setLoadMore(true);
  }, [selectedList.selectedSong]);

  useEffect(() => {
    if(loadMore) 
      searchContent(
        searchParams.get('search'), 
        { append: true, page: selectedList.pageInfo.nextPageToken }
      );
    setLoadMore(false);
  }, [loadMore]);
  
  if(searchError) return (
    <div>
      <h1>Error: { searchError.message }</h1>
    </div>
  )

  return(
    <div className='flex'>

      <div className={ selectedList.selectedSong ? 'w-1/2' : 'w-full' }>
        <div className='flex'>
          <h2 className='font-bold text-xl mb-4 mr-2'>
            Songs 
            <span className='font-normal text-base'>
              &nbsp;- { selectedList.entries.length + (selectedList.entriesType === 'searchPlaylist' ? ' / ' + selectedList.pageInfo.totalResults : '') } songs
            </span>
          </h2>
          <button onClick={ handleSavePlaylist }><FiPlus /></button>
        </div>

        {
          selectedList.entries.length !== 0 && (
            <div 
              className={ `${ selectedList.selectedSong ? 'h-[75vh]' : 'h-[80vh]' } overflow-scroll pr-3` }
            >
              { 
                selectedList.entries.map((item, index) => {
                  const id = getResourceId(item);
                  const selectedSongId = selectedList.selectedSong ? 
                    getResourceId(selectedList.selectedSong) : 
                    null;

                  return <MusicEntry 
                  		key={ id }
                      index={ index }
                      resource={ item } 
                      resourceOrigin={ selectedList.entriesType } 
                      selected={ (id === selectedSongId) }
                      onSelect={ handleSelect }
                    />;
                }) 
              }
            </div>
          )
        }
      </div>

      {
        selectedList.selectedSong && (
          <div className='w-1/2 px-5 mt-11 flex'>
            <div className='w-[320px] h-[180px] min-w-[320px]'>
              <img 
                src={ selectedList.selectedSong.snippet.thumbnails.high.url } 
                className='h-full' 
              />
            </div>

            <div className='text-sm'>
              <p>{ decode(selectedList.selectedSong.snippet.title) }</p>
              <p>{ selectedList.selectedSong.snippet.channelTitle }</p>
              <p>{ selectedList.selectedSong.snippet.publishedAt }</p>
            </div>
          </div>
        )
      }
    </div>
  );
}

const MusicEntry = ({index, resource, resourceOrigin, selected, onSelect }) => {
  const { user } = useAuth();

  const controls = (resourceOrigin === 'search' ? (
    <FiPlus />
  ) : (
    <FaTrash />
  ) );

  const classes = `
    w-full p-1 mb-2 
    hover:cursor-pointer hover:bg-zinc-800
    flex justify-between items-center 
    border ${ selected ? 'border-blue-600 text-blue-600' : '' }
  `;
  
  const id = getResourceId(resource);
  return(
    <div className={ classes } onClick={ () => onSelect(id) }>
      <div>
        <p>{ index + 1 }. { decode(resource.snippet.title) }</p>
      </div>

      <div onClickCapture={ (event) => { event.stopPropagation(); addSong(convertYoutubeEntryToEhosEntry(resource), user.uid) } }>
        { controls }
      </div>
    </div>
  );
}

export default MusicList;