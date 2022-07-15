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
    console.log('search');
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
    <div className='h-min'>
      <form method='get'>
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
      </form>
    </div>
  );
}

export default SearchBar;