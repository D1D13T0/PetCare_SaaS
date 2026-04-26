import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/layout/Logo';
import api from '../services/api';

export default function Register() {
	const navigate = useNavigate();

	const [loading, setLoading] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	async function handleRegister(e: React.FormEvent) {
		e.preventDefault();

		if (password !== confirmPassword) {
			toast.error('As senhas não coincidem');
			return;
		}

		setLoading(true);

		try {
			const response = await api.post('/auth/register', {
				email,
				password,
			});

			const { token, user } = response.data;

			localStorage.setItem('token', token);
			localStorage.setItem('user', JSON.stringify(user));

			toast.success('Conta criada com sucesso!');
			navigate('/home');
		} catch (error: any) {
			toast.error(error.response?.data?.message || 'Erro ao registrar');
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
					Criar conta
				</h1>

				<form onSubmit={handleRegister} className="flex flex-col gap-4">
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

					<div>
						<label className="text-sm text-gray-700">Confirmar senha</label>
						<input
							type="password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
							required
						/>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="w-full bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer font-semibold py-2.5 rounded-lg transition disabled:opacity-50"
					>
						{loading ? 'Criando conta...' : 'Criar conta'}
					</button>
				</form>

				<p className="text-sm text-center text-gray-500 mt-4">
					Já possui conta?{' '}
					<Link
						to="/"
						className="text-emerald-600 font-medium hover:text-emerald-700"
					>
						Fazer login
					</Link>
				</p>
			</div>
		</div>
	);
}
