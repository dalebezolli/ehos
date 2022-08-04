import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = _ => {
	const navigate = useNavigate();
	const location = useLocation();
	const auth = useAuth();

	let from = location.state ? location.state.from : null;
	let path = from ? from.pathname + from.search : '/';

	const handleLogin = (event) => {
		auth.signin(() => { navigate(path, { replace: true }) });
	}

	return (
		<div>
			<button
				className='bg-white p-3 text-black'
				onClick={ handleLogin }>
				Login
			</button>
		</div>
	);
}

export default Login;