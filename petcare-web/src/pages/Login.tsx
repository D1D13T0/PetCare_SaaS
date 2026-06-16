import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/layout/Logo';
import { useAuth } from '../context/AuthContext';

function GoogleIcon() {
	return (
		<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
			<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
			<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
			<path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
			<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
		</svg>
	);
}

export default function Login() {
	const { login, loginWithGoogle, logout } = useAuth();
	const navigate = useNavigate();

	const [loading, setLoading] = useState(false);
	const [loadingGoogle, setLoadingGoogle] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	async function handleLogin(e: { preventDefault(): void }) {
		e.preventDefault();
		setLoading(true);
		try {
			await login(email, password);
			const user = JSON.parse(localStorage.getItem('user') ?? 'null');
			if (user?.role === 'ADMIN') {
				logout();
				toast.error('Email ou senha inválidos');
				return;
			}
			toast.success('Login realizado com sucesso!');
			navigate('/home');
		} catch {
			toast.error('Email ou senha inválidos');
		} finally {
			setLoading(false);
		}
	}

	async function handleGoogleLogin() {
		setLoadingGoogle(true);
		try {
			await loginWithGoogle();
			const user = JSON.parse(localStorage.getItem('user') ?? 'null');
			if (user?.role === 'ADMIN') {
				logout();
				toast.error('Email ou senha inválidos');
				return;
			}
			toast.success('Login realizado com sucesso!');
			navigate('/home');
		} catch {
			toast.error('Erro ao fazer login com Google');
		} finally {
			setLoadingGoogle(false);
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center px-4">
			<div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-100">
				<div className="flex justify-center mb-6">
					<Logo />
				</div>

				<h1 className="text-2xl font-semibold text-gray-800 text-center mb-6">
					Fazer Login
				</h1>

				<form onSubmit={handleLogin} className="flex flex-col gap-4">
					<div>
						<label className="text-sm text-gray-700">Email</label>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
							required
						/>
					</div>

					<div>
						<label className="text-sm text-gray-700">Senha</label>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
							required
						/>
						</div>

					<button
						type="submit"
						disabled={loading}
						className="w-full bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer font-semibold py-2.5 rounded-lg transition disabled:opacity-50"
					>
						{loading ? 'Entrando...' : 'Entrar'}
					</button>
				</form>

				<div className="flex items-center gap-3 my-4">
					<div className="flex-1 h-px bg-gray-200" />
					<span className="text-xs text-gray-400">ou</span>
					<div className="flex-1 h-px bg-gray-200" />
				</div>

				<button
					type="button"
					onClick={handleGoogleLogin}
					disabled={loadingGoogle}
					className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer disabled:opacity-50"
				>
					<GoogleIcon />
					{loadingGoogle ? 'Aguarde...' : 'Continuar com Google'}
				</button>

	
				<p className="text-sm text-center text-gray-500 mt-4">
					Não possui conta?{' '}
					<Link to="/register" className="text-emerald-600 font-medium hover:text-emerald-700">
						Cadastre-se
					</Link>
				</p>

				<p className="text-xs text-center text-gray-400 mt-2">
					<Link to="/admin-login" className="hover:text-gray-600 transition">
						Acesso administrativo →
					</Link>
				</p>
			</div>
		</div>
	);
}
