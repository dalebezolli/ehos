import { useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { FaSearch } from 'react-icons/fa';

const SearchBar = _ => {
  const contentSearchInput = useRef();

  const navigate = useNavigate();
  const [ searchParams, setSearchParams ] = useSearchParams();

  const handleKeyUp = (event) => {
    event.preventDefault();   

    if(event.keyCode !== 13) return;
    const input = contentSearchInput.current.value;
    if(!input) return;

    if(searchParams.get('serarch') === input) return;
    navigate(`/list?search=${ encodeURIComponent(input) }`);
  }

  const handleClick = (event) => {
    event.preventDefault();   
    const input = contentSearchInput.current.value;
    if(!input) return;

    if(searchParams.get('serarch') === input) return;
    navigate(`/list?search=${ encodeURIComponent(input) }`);
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