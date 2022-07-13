import { useContext, useRef } from 'react';
import { ContentViewerContext } from '../context/ContentViewerContext';

import { FaSearch } from 'react-icons/fa';

const SearchBar = _ => {
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

export default SearchBar;