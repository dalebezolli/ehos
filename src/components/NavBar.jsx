import { useAuth } from '../context/AuthContext';

import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';

const NavBar = _ => {
	const auth = useAuth();

	return(
		<nav>
			<div className='flex items-center h-[10vh] bg-dark-secondary'>

					<Link to='/' className='ml-8 text-3xl tracking-[.3em] hover:text-primary'>
						EHOS
					</Link>

					<div className='ml-28'>
						<SearchBar />
					</div>

					<div className='w-full mr-8 flex justify-end'>
						{
							auth.user? 
								<UserIcon user={ auth.user } /> :
								<Link to='/login'>Login</Link>
						}
					</div>
			</div>
		</nav>
	);
}

const UserIcon = ({ user }) => {
  return (
    <div className='w-8 h-8'>
			<img src={ user.photoURL } alt={ `${user.displayName}'s Icon` } className='rounded-full' />
		</div>
  );
}

export default NavBar;