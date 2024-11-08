import { useDispatch } from 'react-redux';
import { clearUser } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';

export const handleLogout = (dispatch, navigate) => {
  localStorage.removeItem('token');
  dispatch(clearUser());
  navigate('/');
};

// En el componente donde llames a handleLogout:
const SomeComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = () => handleLogout(dispatch, navigate);

  return (
    <button onClick={logout}>Logout</button>
  );
};
