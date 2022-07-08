import { decode } from 'he';
import { Route, Link } from 'wouter';
import { useState, useRef } from 'react';

import { searchData, searchPlaylist } from './api';

import { FaSearch } from 'react-icons/fa';

function App() {
  const [ searchResult, setSearchResult ] = useState([]);
  const [ searchResultLoading, setSearchResultLoading ] = useState(false);

  const handleSearch = async (query) => {
    setSearchResultLoading(true);
    const response = await searchData(query);   
    setSearchResult(response.items);
    setSearchResultLoading(false);
  }

  return(
    <div>
      <nav className='container mx-auto'>
        <div className='flex justify-between py-3'>
            <Link href='/' className='font-bold hover:text-pink-600'>
              Music Manager
            </Link>
            <SearchBar onSearch={ handleSearch } />
            <UserIcon />
        </div>
        <hr />
      </nav>

      <div className='container mx-auto pt-3'>
        {
          searchResultLoading ? (
            <p>searchResultLoading...</p>
          ) : (
            <MusicList contentData={ searchResult } contentOrigin={ "search" } /> 
          )
        }
      </div>
    </div>
  );
}

function UserIcon() {
  return (
    <div className='w-6 h-6 bg-white rounded-full'></div>
  );
}

function SearchBar({ onSearch }) {
  const contentSearchInput = useRef();

  const handleKeyUp = (key) => {
    if(key.keyCode !== 13) return;
    const input = contentSearchInput.current.value;
    if(!input) return;

    onSearch(input);
  }

  const handleClick = _ => {
    const input = contentSearchInput.current.value;
    if(!input) return;

    onSearch(input);
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

function MusicList({ contentData, contentOrigin }) {
  return(
    <div>
      <h2 className='font-bold text-xl'>
        Songs 
        <span className='font-normal text-base'>
          &nbsp;- { contentData.length } songs
        </span>
      </h2>
      { 
        contentData.map(item => {
          return <p key={ item.id.videoId }>{ decode(item.snippet.title) }</p>;
        }) 
      }
    </div>
  );
}

export default App;