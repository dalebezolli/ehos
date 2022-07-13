import { Link } from 'wouter';
import SearchBar from './SearchBar';

const NavBar = _ => {
	return(
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
	);
}

const UserIcon = _ => {
  return (
    <div className='w-6 h-6 bg-white rounded-full'></div>
  );
}

export default NavBar;