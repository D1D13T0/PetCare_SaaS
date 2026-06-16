import { getRedirectResult, signInWithRedirect } from 'firebase/auth';
import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { auth, googleProvider } from '../lib/firebase';
import api from '../services/api';

interface AuthContextType {
	user: any;
	login: (email: string, password: string) => Promise<void>;
	loginWithGoogle: () => Promise<void>;
	handleGoogleRedirect: () => Promise<boolean>;
	updateUser: (updated: any) => void;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<any>(() => {
		const storedUser = localStorage.getItem('user');
		if (!storedUser || storedUser === 'undefined') return null;
		try {
			return JSON.parse(storedUser);
		} catch {
			return null;
		}
	});

	async function login(email: string, password: string) {
		const response = await api.post('/auth/login', { email, password });
		const { token, user } = response.data;
		localStorage.setItem('token', token);
		localStorage.setItem('user', JSON.stringify(user));
		setUser(user);
	}

	async function loginWithGoogle() {
		await signInWithRedirect(auth, googleProvider);
	}

	async function handleGoogleRedirect(): Promise<boolean> {
		const result = await getRedirectResult(auth);
		if (!result) return false;
		const idToken = await result.user.getIdToken(true);
		const response = await api.post('/auth/google', { idToken });
		const { token, user } = response.data;
		localStorage.setItem('token', token);
		localStorage.setItem('user', JSON.stringify(user));
		setUser(user);
		return true;
	}

	function updateUser(updated: any) {
		localStorage.setItem('user', JSON.stringify(updated));
		setUser(updated);
	}

	function logout() {
		localStorage.removeItem('token');
		localStorage.removeItem('user');
		setUser(null);
	}

	return (
		<AuthContext.Provider value={{ user, login, loginWithGoogle, handleGoogleRedirect, updateUser, logout }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used inside AuthProvider');
	}
	return context;
}
