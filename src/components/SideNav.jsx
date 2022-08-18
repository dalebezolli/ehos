import { Link } from 'react-router-dom';

const SideNav = _ => {
	const links = [
		{
			icon: <div className='w-4 h-4 bg-light-secondary group-hover:bg-light'></div>,
			name: 'Home',
			location: '/',
		},
		{
			icon: <div className='w-4 h-4 bg-light-secondary group-hover:bg-light'></div>,
			name: 'Tags',
			location: '/tageditor',
		},
	]

	return (
		<div className='bg-dark-secondary min-w-[250px]'>
			{ 
				links.map((link) => {
					return <NavLink key={ link.name } {...link} />
				})
			}
		</div>
	);
};

const NavLink = ({ icon, name, location }) => {
	return (
			<Link to={ location } >
				<div 
					className='
						flex items-center h-16 group
						text-sm font-bold'
				>
					<div className='px-8'>
						{ icon }
					</div>
					<p className='text-light-secondary group-hover:text-light'>{ name }</p>
				</div>
			</Link>
	);
}

export default SideNav;