import { useContext, createContext, useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { googleSignIn } from '../utils/firebase';

let AuthContext = createContext();

export default function AuthProvider({ children }) {
	let [ user, setUser ] = useState(JSON.parse(localStorage.getItem('user')) || null);

	let signin = (callback) => {
		googleSignIn((user) => {
			setUser(user);
			callback();
		});
	}
	
	let signout = (callback) => {
		localStorage.removeItem('user');
		setUser(null);
		callback();
	} 
	
	let value = { user, signin, signout };

	return (
		<AuthContext.Provider value={ value }>
			{ children }
		</AuthContext.Provider>
	)
}

export const useAuth = () => {
	return useContext(AuthContext);
}

export const AuthRoute = ({ children }) => {
	const auth = useAuth();
	const location = useLocation();

	if(!auth.user) {
		return <Navigate to='/login' state={{ from: location }} replace />;
	}

	return children;
}