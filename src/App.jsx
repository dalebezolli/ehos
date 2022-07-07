import { decode } from 'he';
import { Route, Link } from 'wouter';
import { useState, useEffect, useRef } from 'react';

import { searchData, searchPlaylist } from './api';

function App() {

  useEffect(() => console.log('app'));

  return(
    <div>
      <nav className='container mx-auto'>
        <div className='flex justify-between'>
          <div className='py-3'>
            <Link href='/' className='text-blue-400 hover:text-pink-600'>
              home
            </Link>
          </div>
          <div className='py-3'>
            <Link href='/search' className='text-blue-400 hover:text-pink-600'>
              search song
            </Link>
          </div>
          <div className='py-3'>
            <Link href='/manager' className='text-blue-400 hover:text-pink-600'>
              playlist manager
            </Link>
          </div>
        </div>
        <hr className='border border-black' />
      </nav>

      <div className='container mx-auto pt-3'>
        <Route path='/'>
          <p>Welcome to the best Music Manager that exists!</p>
        </Route>
        <Route path='/search'>
          <SearchRoute />
        </Route>
        <Route path='/manager'>
          <PlaylistManagerRoute />
        </Route>
      </div>
    </div>
  );
}

function SearchRoute() {
  const [ content, setContent ] = useState([]);
  const searchQueryInput = useRef();

  const search = async (query) => {
    if(!query) return;   

    const res = await searchData(query);
    setContent(res.items);
  }

  return(
    <div>
      <h2 className='font-bold text-2xl'>Search your favourite music</h2>

      <div>
        <input type="text" 
          name='search-query' 
          ref={ searchQueryInput } 
          className='border border-solid border-b-black inline-block'
        />
        <a 
          className='font-bold ml-5 hover:text-pink-600 hover:cursor-pointer' 
          onClick={ () => { search(searchQueryInput.current.value); } }
        >Search</a>
      </div>

      <MusicList content={ content } />
    </div>
  );
}

function PlaylistManagerRoute() {
  const [ content, setContent ] = useState([]);
  const searchQueryInput = useRef();

  const playlistContentSearch = async (playlistId) => {
    if(!playlistId) return;   

    const res = await searchPlaylist(playlistId);
    console.log(res);
    if(res === null) return;
    setContent(res.items);
  }

  return(
    <div>
      <h2 className='font-bold text-2xl'>Playlist Manager</h2>

      <div>
        <input type="text" 
          name='search-query' 
          ref={ searchQueryInput } 
          className='border border-solid border-b-black inline-block'
        />
        <a 
          className='font-bold ml-5 hover:text-pink-600 hover:cursor-pointer' 
          onClick={ () => { playlistContentSearch(searchQueryInput.current.value); } }
        >Search</a>
      </div>

      <MusicList content={ content } />
    </div>
  );
}

function MusicList({ content }) {
  return(
    <div>
      <h2 className='font-bold text-xl'>Songs</h2>
      { content.map(item => {
        return <p key={ item.id.videoId }>{ decode(item.snippet.title) }</p>;
      }) }
    </div>
  );
}

export default App;