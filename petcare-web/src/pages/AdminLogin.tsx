import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/layout/Logo';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
	const { login, logout } = useAuth();
	const navigate = useNavigate();

	const [loading, setLoading] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	async function handleLogin(e: { preventDefault(): void }) {
		e.preventDefault();
		setLoading(true);
		try {
			await login(email, password);

			const user = JSON.parse(localStorage.getItem('user') ?? 'null');
			if (user?.role !== 'ADMIN') {
				logout();
				toast.error('Acesso restrito a administradores');
				return;
			}

			toast.success('Login realizado com sucesso!');
			navigate(user.clinic_id ? '/home' : '/onboarding');
		} catch {
			toast.error('Email ou senha inválidos');
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center px-4">
			<div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-100">
				<div className="flex justify-center mb-6">
					<Logo />
				</div>

				<h1 className="text-2xl font-semibold text-gray-800 text-center mb-1">
					Acesso Administrativo
				</h1>
				<p className="text-sm text-gray-500 text-center mb-6">
					Área exclusiva para administradores de clínica
				</p>

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
						{loading ? 'Entrando...' : 'Entrar como administrador'}
					</button>
				</form>

				<p className="text-xs text-center text-gray-400 mt-4">
					<Link to="/login" className="hover:text-gray-600 transition">
						← Voltar ao login
					</Link>
				</p>
			</div>
		</div>
	);
}
