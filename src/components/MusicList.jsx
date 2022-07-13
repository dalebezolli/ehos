import { useState, useContext } from 'react';

import { ContentViewerContext } from '../context/ContentViewerContext';
import ContentPlayer from './ContentPlayer';

import { getResourceId } from '../utils/getResourceId';
import { decode } from 'he';

import { FiPlus } from 'react-icons/fi';
import { FaTrash } from 'react-icons/fa';

const MusicList = () => {
  const { selectedList, selectSong } = useContext(ContentViewerContext);

  const handleSelect = (resourceId) => {
    const resource = selectedList.entries.find((item) => {
      const id = getResourceId(item);
      
      return id === resourceId;
    })   

    selectSong(resource);
  };

  return(
    <div className='flex'>

      <div className={ selectedList.selectedSong ? 'w-1/2' : 'w-full' }>
        <h2 className='font-bold text-xl mb-4'>
          Songs 
          <span className='font-normal text-base'>
            &nbsp;- { selectedList.entries.length } songs
          </span>
        </h2>

        {
          selectedList.entries.length !== 0 && (
            <div>
              { 
                selectedList.entries.map((item) => {
                  const id = getResourceId(item);

                  return ( 
                    <MusicEntry 
                      key={ id } 
                      resource={ item } 
                      resourceOrigin={ selectedList.entriesType } 
                      selected={ (id === selectedList.selectedSong ) }
                      onSelect={ handleSelect }
                    />
                  );
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

const MusicEntry = ({resource, resourceOrigin, selected, onSelect }) => {
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
        <p>{ decode(resource.snippet.title) }</p>
      </div>

      <div>
        { controls }
      </div>
    </div>
  );
}

export default MusicList;