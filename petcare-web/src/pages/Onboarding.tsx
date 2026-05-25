import { Building2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/layout/Logo';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Onboarding() {
	const { user, updateUser, logout } = useAuth();
	const navigate = useNavigate();

	const [name, setName] = useState('');
	const [cnpj, setCnpj] = useState('');
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!user) {
			navigate('/login', { replace: true });
			return;
		}
		if (user.clinic_id) {
			navigate('/home', { replace: true });
		}
	}, [user]);

	async function handleCreate(e: { preventDefault(): void }) {
		e.preventDefault();
		setLoading(true);
		try {
			const response = await api.post('/clinic', {
				name,
				cnpj: cnpj || undefined,
			});
			updateUser({ ...user, clinic_id: response.data.id });
			toast.success('Clínica criada com sucesso!');
			navigate('/home', { replace: true });
		} catch (err: any) {
			const msg = err?.response?.data?.message ?? 'Erro ao criar clínica';
			toast.error(msg);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
			<div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-100">
				<div className="flex justify-center mb-6">
					<Logo />
				</div>

				<div className="flex items-center justify-center gap-2 mb-2">
					<Building2 className="text-emerald-600" width={22} height={22} />
					<h1 className="text-2xl font-semibold text-gray-800">Criar sua clínica</h1>
				</div>
				<p className="text-sm text-gray-500 text-center mb-6">
					Para começar a usar o PetCare, cadastre os dados da sua clínica.
				</p>

				<form onSubmit={handleCreate} className="flex flex-col gap-4">
					<div>
						<label className="text-sm text-gray-700">Nome da clínica</label>
						<input
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
							required
						/>
					</div>
					<div>
						<label className="text-sm text-gray-700">
							CNPJ <span className="text-gray-400">(opcional)</span>
						</label>
						<input
							type="text"
							value={cnpj}
							onChange={(e) => setCnpj(e.target.value)}
							placeholder="00.000.000/0000-00"
							className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
						/>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="w-full bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer font-semibold py-2.5 rounded-lg transition disabled:opacity-50 mt-2"
					>
						{loading ? 'Criando...' : 'Criar clínica e continuar'}
					</button>
				</form>

				<button
					type="button"
					onClick={logout}
					className="w-full text-center text-xs text-gray-400 hover:text-gray-600 mt-4 cursor-pointer transition"
				>
					Sair da conta
				</button>
			</div>
		</div>
	);
}
