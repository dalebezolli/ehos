import { useEffect } from 'react';
import { useContext, createContext, useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { googleSignIn } from '../utils/firebase';

let UserContext = createContext();

export default function UserProvider({ children }) {
	let [ user, setUser ] = useState(() => {
 		return localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null
	});
	const [ lastChangelogDate, setLastChangelogDate ] = useState(localStorage.getItem('lastChangelogDate'));
	const [ lastChangelog, setLastChangelog ] = useState(localStorage.getItem('lastChangelog'));

	useEffect( () => {
		localStorage.setItem('lastChangelog', lastChangelog);
	}, [lastChangelog]);

	useEffect( () => {
		localStorage.setItem('lastChangelogDate', lastChangelogDate);
	}, [lastChangelogDate]);

	let signin = (callback) => {
		googleSignIn((user) => {
			setUser(user);
			setLastChangelogDate(new Date().toLocaleDateString());

			callback();
		});
	}
	
	let signout = (callback) => {
		localStorage.removeItem('user');
		setUser(null);
		callback();
	} 
	
	let value = { user, signin, signout, lastChangelogDate, setLastChangelogDate, lastChangelog, setLastChangelog };

	return (
		<UserContext.Provider value={ value }>
			{ children }
		</UserContext.Provider>
	)
}

export const useUser = () => {
	return useContext(UserContext);
}

export const AuthRoute = ({ children }) => {
	const auth = useUser();
	const location = useLocation();

	if(!auth.user) {
		return <Navigate to='/login' state={{ from: location }} replace />;
	}

	return children;
}