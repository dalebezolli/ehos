import { decode } from 'he';
import { Link } from 'wouter';
import { useState, useRef, useContext } from 'react';
import ContentViewerProvider, { ContentViewerContext } from './ContentViewerContext';

import { FaSearch, FaTrash } from 'react-icons/fa';
import { FiPlus } from 'react-icons/fi';

// TODO: Change this once rest api is built as it will be redundant
function getResourceId(resource, type) {
  return (type === 'search' ? 
    resource.id.videoId :
    resource.snippet.resourceId.videoId
  );
}

function App() {
  return(
    <ContentViewerProvider>
      <nav className='container mx-auto'>
        <div className='flex justify-between py-3'>
            <Link href='/' className='font-bold hover:text-pink-600'>
              Music Manager
            </Link>
            <SearchBar />
            <UserIcon />
        </div>
        <hr />
      </nav>

      <div className='container mx-auto pt-3'>
        <MusicList /> 
      </div>
    </ContentViewerProvider>
  );
}

function UserIcon() {
  return (
    <div className='w-6 h-6 bg-white rounded-full'></div>
  );
}

function SearchBar() {
  const contentSearchInput = useRef();
  const { searchContent } = useContext(ContentViewerContext);

  const handleKeyUp = (key) => {
    if(key.keyCode !== 13) return;
    const input = contentSearchInput.current.value;
    if(!input) return;

    searchContent(input);
  }

  const handleClick = _ => {
    const input = contentSearchInput.current.value;
    if(!input) return;

    searchContent(input);
  };

  return (
    <div className='h-min'>
      <input 
        type='text' 
        name='content-search' 
        id='content-search' 
        placeholder='Search'
        ref={ contentSearchInput }
        onKeyUp={ handleKeyUp }
        className='bg-black text-white w-[400px] border border-black border-b-white'
      />

      <button 
        className='px-2 hover:text-pink-600' 
        onClick={ handleClick }
      >
        <FaSearch />
      </button>
    </div>
  );
}

function MusicList() {
  const { selectedList } = useContext(ContentViewerContext);
  const [ selectedSong, setSelectedSong ] = useState(null);

  const handleSelect = (resourceId) => {
    const resource = selectedList.entries.find((item) => {
      const id = getResourceId(item, selectedList.entriesType);
      
      return id === resourceId;
    })   

    setSelectedSong(resource);
  };

  return(
    <div className='flex'>

      <div className={ selectedSong ? 'w-1/2' : 'w-full' }>
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
                selectedList.entries.map((item, index) => {
                  const id = getResourceId(item, selectedList.entriesType);

                  return ( 
                    <MusicEntry 
                      key={ id } 
                      resource={ item } 
                      resourceOrigin={ selectedList.entriesType } 
                      selected={ (id === selectedSong ) }
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
        selectedSong && (
          <div className='w-1/2 px-5 mt-11 flex'>
            <div className='w-[320px] h-[180px]'>
              <img src={ selectedSong.snippet.thumbnails.high.url } className='h-full' />
            </div>

            <div className='text-sm'>
              { console.log(selectedSong) }
              <p>{ decode(selectedSong.snippet.title) }</p>
              <p>{ selectedSong.snippet.channelTitle }</p>
              <p>{ selectedSong.snippet.publishedAt }</p>
            </div>
          </div>
        )
      }

    </div>
  );
}

function MusicEntry({resource, resourceOrigin, selected, onSelect }) {
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
  
  const id = getResourceId(resource, resourceOrigin);
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

export default App;