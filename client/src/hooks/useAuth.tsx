import { useContext } from 'react';
import AuthContext from '../context/authContext';

/**
 * Build and return AuthContext
 * @returns {AuthContextType}
 */
export const useAuth = () => useContext(AuthContext);
