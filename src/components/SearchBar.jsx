import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { FaSearch } from 'react-icons/fa';

const SearchBar = _ => {
  const contentSearchInput = useRef();
  const navigate = useNavigate();

  const search = (input) => {
    if(!input) return;

    const path = window.location.pathname.split('/');
    if(path[path.length - 1] === input) return;
    navigate(`/search/${ encodeURIComponent(input) }`);
  }

  const handleKeyUp = (event) => {
    event.preventDefault();   

    if(event.keyCode !== 13) return;
    const input = contentSearchInput.current.value;
    search(input);
  }

  const handleClick = (event) => {
    event.preventDefault();   
    const input = contentSearchInput.current.value;
    search(input);
  };

  return (
    <form 
      method='get' 
      className='
        flex p-2 bg-dark-secondary 
      focus-within:bg-input-focus rounded-3xl 
        transition-all'
    >
      <button 
        className='pl-2 pr-4 text-light-secondary hover:text-light transition-colors' 
        onClick={ handleClick }
      >
        <FaSearch />
      </button>

      <input 
        type='text' 
        name='content-search' 
        id='content-search' 
        placeholder='Search'
        ref={ contentSearchInput }
        onKeyUp={ handleKeyUp }
        className='
          bg-inherit 
          text-light placeholder-light-secondary 
          w-[400px] outline-none
          transition-all'
      />
    </form>
  );
}

export default SearchBar;