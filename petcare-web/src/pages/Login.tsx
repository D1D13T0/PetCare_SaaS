import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/layout/Logo';
import { useAuth } from '../context/AuthContext';

export default function Login() {
	const { login } = useAuth();
	const navigate = useNavigate();

	const [loading, setLoading] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	async function handleLogin(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true);

		try {
			await login(email, password);
			toast.success('Login realizado com sucesso!');
			navigate('/home');
		} catch (error: any) {
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

				<p className="text-sm text-center text-gray-500 mt-4">
					Não possui conta?{' '}
					<Link
						to="/register"
						className="text-emerald-600 font-medium hover:text-emerald-700"
					>
						Cadastre-se
					</Link>
				</p>
			</div>
		</div>
	);
}
