import { KeyRound, User } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const inputClass =
	'w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-emerald-500 focus:outline-none';

const roleLabel: Record<string, string> = {
	ADMIN: 'Administrador',
	OWNER: 'Veterinário',
};

export default function Profile() {
	const { user } = useAuth();

	const [currentPassword, setCurrentPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [loading, setLoading] = useState(false);

	async function handleChangePassword(e: { preventDefault(): void }) {
		e.preventDefault();

		if (newPassword !== confirmPassword) {
			toast.error('As senhas não coincidem');
			return;
		}

		if (newPassword.length < 6) {
			toast.error('A nova senha deve ter pelo menos 6 caracteres');
			return;
		}

		setLoading(true);
		try {
			await api.patch('/auth/password', { currentPassword, newPassword });
			toast.success('Senha alterada com sucesso!');
			setCurrentPassword('');
			setNewPassword('');
			setConfirmPassword('');
		} catch (err: any) {
			const msg = err?.response?.data?.message ?? 'Erro ao alterar senha';
			toast.error(msg);
		} finally {
			setLoading(false);
		}
	}

	return (
		<Layout>
			<div className="mb-8">
				<h1 className="text-3xl font-semibold text-gray-800">Meu perfil</h1>
				<p className="text-gray-500 text-sm">Informações da sua conta</p>
			</div>

			<div className="grid grid-cols-1 gap-6 max-w-lg">
				{/* Dados da conta */}
				<div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
					<div className="flex items-center gap-2 mb-5">
						<User className="text-emerald-600" width={20} height={20} />
						<h2 className="text-lg font-semibold text-gray-800">Dados da conta</h2>
					</div>
					<div className="flex flex-col gap-3 text-sm">
						<div>
							<p className="text-xs text-gray-400">Email</p>
							<p className="font-medium text-gray-700 mt-0.5">{user?.email}</p>
						</div>
						<div>
							<p className="text-xs text-gray-400">Perfil</p>
							<p className="font-medium text-gray-700 mt-0.5">
								{roleLabel[user?.role] ?? user?.role}
							</p>
						</div>
					</div>
				</div>

				{/* Alterar senha */}
				<div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
					<div className="flex items-center gap-2 mb-5">
						<KeyRound className="text-emerald-600" width={20} height={20} />
						<h2 className="text-lg font-semibold text-gray-800">Alterar senha</h2>
					</div>
					<form onSubmit={handleChangePassword} className="flex flex-col gap-4">
						<div>
							<label className="text-sm font-medium text-gray-600">Senha atual</label>
							<input
								type="password"
								value={currentPassword}
								onChange={(e) => setCurrentPassword(e.target.value)}
								className={inputClass}
								required
							/>
						</div>
						<div>
							<label className="text-sm font-medium text-gray-600">Nova senha</label>
							<input
								type="password"
								value={newPassword}
								onChange={(e) => setNewPassword(e.target.value)}
								className={inputClass}
								required
							/>
						</div>
						<div>
							<label className="text-sm font-medium text-gray-600">Confirmar nova senha</label>
							<input
								type="password"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								className={inputClass}
								required
							/>
						</div>
						<div className="flex justify-end mt-1">
							<Button type="submit" className="w-auto px-6" disabled={loading}>
								{loading ? 'Salvando...' : 'Alterar senha'}
							</Button>
						</div>
					</form>
				</div>
			</div>
		</Layout>
	);
}
