import { Clock } from 'lucide-react';
import Logo from '../components/layout/Logo';
import { useAuth } from '../context/AuthContext';

export default function Pending() {
	const { user, logout } = useAuth();

	return (
		<div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
			<div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-100 text-center">
				<div className="flex justify-center mb-6">
					<Logo />
				</div>

				<div className="flex justify-center mb-4">
					<Clock className="text-amber-400" width={40} height={40} />
				</div>

				<h1 className="text-xl font-semibold text-gray-800 mb-2">
					Aguardando vinculação
				</h1>
				<p className="text-sm text-gray-500 mb-1">
					Sua conta <strong>{user?.email}</strong> ainda não está vinculada a nenhuma clínica.
				</p>
				<p className="text-sm text-gray-500 mb-6">
					Peça ao administrador da clínica que adicione seu email no painel de membros.
				</p>

				<button
					type="button"
					onClick={logout}
					className="text-sm text-emerald-600 hover:text-emerald-700 font-medium cursor-pointer transition"
				>
					Sair da conta
				</button>
			</div>
		</div>
	);
}
