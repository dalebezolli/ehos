import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useUser } from '../context/UserContext';
import SearchBar from './SearchBar';

const NavBar = _ => {
	const navigate = useNavigate();
	const { user, signout } = useUser();
	const [showUserOptions, setShowUserOptions] = useState(false);

	return(
		<nav className='fixed w-full bg-dark'>
			<div className='container mx-auto h-[60px] transition-all'>
				<div className='flex justify-between items-center h-full'>
					<div className='relative ml-4 sm:ml-2'>
						<div className='absolute w-8 h-8 bg-primary z-[-1] rounded-full -translate-x-1/4'></div>
						<Link to='/' className='text-2xl tracking-[.4rem]'>
							EHOS
						</Link>
					</div>
	
					<SearchBar />

					<div className='mr-4 sm:mr-2 relative' >
						{
							user && ( 
								<div 
									className='cursor-pointer'
									onClick={ (event) => { if(event.target.tagName === 'IMG')
										setShowUserOptions(!showUserOptions) 
									}}
								>
									<UserIcon user={ user } />
								</div>
							)
						}
						{
							(showUserOptions && user) && (
								<div className='
									absolute
									top-1/2 right-0
									bg-dark-secondary text-light-secondary
									w-[250px]
									pt-4 px-6 pb-4
									rounded-md
									text-sm
									drop-shadow-[0px_0px_20px_#111111FF]
								'>
									<p className='font-bold pb-2'>{ user.displayName }</p>
									<button className='py-1 w-full text-left hover:text-light'
										onClick={ () => { navigate('/tageditor') } }
									>Tags</button>
									<div className='h-[1px] bg-[#FFFFFF0A] my-2'></div>
									<button className='py-1 w-full text-left hover:text-light'
										onClick={ () => { signout(); setShowUserOptions(false) } }
									>Log out</button>
								</div>
							)
						}
					</div>
				</div>
			</div>

		</nav>
	);
}

const UserIcon = ({ user }) => {
  return (
    <div className='w-8 h-8 relative z-10'>
			<img src={ user.photoURL } alt={ `${user.displayName}'s Icon` } className='rounded-full' />
		</div>
  );
}

export default NavBar;