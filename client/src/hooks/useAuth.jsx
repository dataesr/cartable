import {
  useState,
  createContext,
  useContext,
  useMemo,
  useEffect,
  useCallback,
  useTransition,
} from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AuthContext = createContext();
const unexpectedError = 'Erreur inattendue';
const { VITE_APP_NAME, VITE_APP_API_URL } = import.meta.env;

async function refreshToken() {
  const refresh = localStorage.getItem(`__${VITE_APP_NAME.toLowerCase()}_refresh__`);
  if (!refresh) return false;
  const url = `${VITE_APP_API_URL}/tokens`;
  const body = JSON.stringify({ refreshToken: refresh });
  const headers = { 'Content-Type': 'application/json' };
  const data = await fetch(url, { method: 'POST', body, headers })
    .then((response) => response.json())
    .catch(() => false);
  if (data && data.accessToken) {
    localStorage.setItem(`__${VITE_APP_NAME.toLowerCase()}_access__`, data.accessToken);
    localStorage.setItem(`__${VITE_APP_NAME.toLowerCase()}_refresh__`, data.refreshToken);
    return true;
  }
  return false;
}

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [viewer, setViewer] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const fetchViewer = useCallback(async () => {
    await api.get('/me')
      .then((response) => setViewer(response.data))
      .catch(() => setViewer({}));
    startTransition(() => {
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    setIsLoading(true);
    if (localStorage.getItem(`__${VITE_APP_NAME.toLowerCase()}_refresh__`)) {
      refreshToken()
        .then((result) => { if (result) fetchViewer(); else setIsLoading(false); })
        .catch(() => setIsLoading(false));
    } else { setIsLoading(false); }
    const refresher = setInterval(async () => refreshToken(), (1000 * 60 * 9));
    return () => clearInterval(refresher);
  }, [fetchViewer]);

  const requestPasswordChangeEmail = useCallback(async ({ email }) => {
    const url = `${VITE_APP_API_URL}/passwordless`;
    const body = JSON.stringify({ email });
    const headers = { [`X-${VITE_APP_NAME}-OTP-Method`]: 'email', 'Content-Type': 'application/json' };
    return fetch(url, { method: 'POST', body, headers })
      .then((response) => response.json())
      .then((data) => data)
      .catch(() => ({ error: unexpectedError }));
  }, []);

  const changePassword = useCallback(async ({ email, password, otp, firstName, lastName }) => {
    const url = `${VITE_APP_API_URL}/passwordless`;
    const body = JSON.stringify({ email, password, firstName, lastName });
    const headers = { [`X-${VITE_APP_NAME}-OTP`]: otp, 'Content-Type': 'application/json' };
    return fetch(url, { method: 'POST', body, headers })
      .then((response) => response.json())
      .then((data) => data)
      .catch(() => ({ error: unexpectedError }));
  }, []);

  const signin = useCallback(async ({ email, password, otp = null, otpMethod = null }) => {
    const url = `${VITE_APP_API_URL}/signin`;
    const body = JSON.stringify({ email, password });
    const headers = { 'Content-Type': 'application/json' };
    if (otp) { headers[`X-${VITE_APP_NAME}-OTP`] = otp; }
    if (otpMethod) { headers[`X-${VITE_APP_NAME}-OTP-METHOD`] = otpMethod; }
    const response = await fetch(url, { method: 'POST', body, headers })
      .catch(() => ({ error: unexpectedError }));
    const data = await response.json().catch(() => ({ error: unexpectedError }));
    response.data = data;
    if (data.accessToken && data.refreshToken) {
      localStorage.setItem(`__${VITE_APP_NAME.toLowerCase()}_access__`, data.accessToken);
      localStorage.setItem(`__${VITE_APP_NAME.toLowerCase()}_refresh__`, data.refreshToken);
      const { data: user } = await api.get('/me');
      setViewer(user || {});
    }
    return response;
  }, []);

  const signout = useCallback(() => {
    localStorage.removeItem(`__${VITE_APP_NAME.toLowerCase()}_access__`);
    localStorage.removeItem(`__${VITE_APP_NAME.toLowerCase()}_refresh__`);
    setViewer({});
    navigate('/');
  }, [navigate]);

  const value = useMemo(() => ({
    isLoading: isLoading || isPending,
    viewer,
    setViewer,
    signin,
    signout,
    changePassword,
    requestPasswordChangeEmail,
  }), [viewer, isLoading, isPending, signout, signin, changePassword, requestPasswordChangeEmail]);
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.any.isRequired,
};

const useAuth = () => useContext(AuthContext);
export default useAuth;
