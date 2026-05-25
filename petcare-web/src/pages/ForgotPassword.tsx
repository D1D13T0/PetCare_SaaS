import { sendPasswordResetEmail } from 'firebase/auth';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import Logo from '../components/layout/Logo';
import { auth } from '../lib/firebase';

export default function ForgotPassword() {
	const [email, setEmail] = useState('');
	const [loading, setLoading] = useState(false);
	const [sent, setSent] = useState(false);

	async function handleSubmit(e: { preventDefault(): void }) {
		e.preventDefault();
		setLoading(true);
		try {
			await sendPasswordResetEmail(auth, email);
			setSent(true);
			toast.success('Email de recuperação enviado!');
		} catch (error: any) {
			if (error.code === 'auth/user-not-found') {
				toast.error('Nenhuma conta encontrada com esse email');
			} else {
				toast.error('Erro ao enviar email de recuperação');
			}
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

				<h1 className="text-2xl font-semibold text-gray-800 text-center mb-2">
					Recuperar senha
				</h1>

				{sent ? (
					<div className="text-center mt-4">
						<p className="text-gray-600 text-sm mb-6">
							Enviamos um link de recuperação para <strong>{email}</strong>. Verifique sua caixa de entrada.
						</p>
						<Link to="/login" className="text-emerald-600 font-medium hover:text-emerald-700 text-sm">
							Voltar para o login
						</Link>
					</div>
				) : (
					<>
						<p className="text-gray-500 text-sm text-center mb-6">
							Informe seu email e enviaremos um link para redefinir sua senha.
						</p>
						<form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
							<button
								type="submit"
								disabled={loading}
								className="w-full bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer font-semibold py-2.5 rounded-lg transition disabled:opacity-50"
							>
								{loading ? 'Enviando...' : 'Enviar link de recuperação'}
							</button>
						</form>
						<p className="text-sm text-center text-gray-500 mt-4">
							Lembrou a senha?{' '}
							<Link to="/login" className="text-emerald-600 font-medium hover:text-emerald-700">
								Fazer login
							</Link>
						</p>
					</>
				)}
			</div>
		</div>
	);
}
