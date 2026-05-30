import { Building2, Trash2, UserPlus, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import ConfirmModal from '../components/ui/ConfirmModal';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import type { Clinic, ClinicUser } from '../types/clinic';

const inputClass =
	'w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-emerald-500 focus:outline-none';

const roleLabel: Record<string, string> = {
	ADMIN: 'Admin',
	OWNER: 'Veterinário',
};

const roleColor: Record<string, string> = {
	ADMIN: 'bg-blue-100 text-blue-700',
	OWNER: 'bg-gray-100 text-gray-600',
};

export function ClinicPage() {
	const { user } = useAuth();
	const isAdmin = user?.role === 'ADMIN';

	const [clinic, setClinic] = useState<Clinic | null>(null);
	const [members, setMembers] = useState<ClinicUser[]>([]);
	const [loadingClinic, setLoadingClinic] = useState(true);
	const [loadingMembers, setLoadingMembers] = useState(true);

	const [name, setName] = useState('');
	const [cnpj, setCnpj] = useState('');
	const [loadingSave, setLoadingSave] = useState(false);

	const [inviteEmail, setInviteEmail] = useState('');
	const [loadingInvite, setLoadingInvite] = useState(false);
	const [loadingRemoveId, setLoadingRemoveId] = useState<string | null>(null);
	const [confirm, setConfirm] = useState<{ memberId: string; email: string } | null>(null);

	useEffect(() => {
		fetchClinic();
		fetchMembers();
	}, []);

	async function fetchClinic() {
		setLoadingClinic(true);
		try {
			const response = await api.get('/clinic');
			setClinic(response.data);
			setName(response.data.name ?? '');
			setCnpj(response.data.cnpj ?? '');
		} catch {
			toast.error('Erro ao carregar dados da clínica');
		} finally {
			setLoadingClinic(false);
		}
	}

	async function fetchMembers() {
		setLoadingMembers(true);
		try {
			const response = await api.get('/clinic/users');
			setMembers(response.data);
		} catch {
			toast.error('Erro ao carregar membros');
		} finally {
			setLoadingMembers(false);
		}
	}

	async function handleSave(e: { preventDefault(): void }) {
		e.preventDefault();
		setLoadingSave(true);
		try {
			const response = await api.put('/clinic', { name, cnpj: cnpj || undefined });
			setClinic(response.data);
			toast.success('Dados da clínica atualizados!');
		} catch (err: any) {
			const msg = err?.response?.data?.message ?? 'Erro ao atualizar clínica';
			toast.error(msg);
		} finally {
			setLoadingSave(false);
		}
	}

	async function handleInvite(e: { preventDefault(): void }) {
		e.preventDefault();
		setLoadingInvite(true);
		try {
			await api.post('/clinic/invite', { email: inviteEmail });
			toast.success('Usuário adicionado à clínica!');
			setInviteEmail('');
			fetchMembers();
		} catch (err: any) {
			const msg = err?.response?.data?.message ?? 'Erro ao convidar usuário';
			toast.error(msg);
		} finally {
			setLoadingInvite(false);
		}
	}

	async function handleRemove() {
		if (!confirm) return;
		const { memberId } = confirm;
		setConfirm(null);
		setLoadingRemoveId(memberId);
		try {
			await api.delete(`/clinic/users/${memberId}`);
			setMembers((prev) => prev.filter((m) => m.id !== memberId));
			toast.success('Membro removido da clínica');
		} catch (err: any) {
			const msg = err?.response?.data?.message ?? 'Erro ao remover membro';
			toast.error(msg);
		} finally {
			setLoadingRemoveId(null);
		}
	}

	return (
		<Layout>
			<div className="mb-8">
				<h1 className="text-3xl font-semibold text-gray-800">Clínica</h1>
				<p className="text-gray-500 text-sm">Dados e membros da sua clínica</p>
			</div>

			<div className="grid grid-cols-1 gap-6 max-w-3xl">
				{/* Card: Dados da Clínica */}
				<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
					<div className="flex items-center gap-2 mb-5">
						<Building2 className="text-emerald-600" width={20} height={20} />
						<h2 className="text-lg font-semibold text-gray-800">Dados da Clínica</h2>
					</div>

					{loadingClinic ? (
						<p className="text-gray-500 text-sm">Carregando...</p>
					) : (
						<form onSubmit={handleSave} className="flex flex-col gap-4">
							<div>
								<label className="text-sm font-medium text-gray-600">Nome da clínica</label>
								<input
									type="text"
									value={name}
									onChange={(e) => setName(e.target.value)}
									className={inputClass}
									disabled={!isAdmin}
									required
								/>
							</div>
							<div>
								<label className="text-sm font-medium text-gray-600">CNPJ</label>
								<input
									type="text"
									value={cnpj}
									onChange={(e) => setCnpj(e.target.value)}
									placeholder="00.000.000/0000-00"
									className={inputClass}
									disabled={!isAdmin}
								/>
							</div>
							{isAdmin && (
								<div className="flex justify-end mt-1">
									<Button type="submit" className="w-auto px-6" disabled={loadingSave}>
										{loadingSave ? 'Salvando...' : 'Salvar alterações'}
									</Button>
								</div>
							)}
						</form>
					)}
				</div>

				{/* Card: Membros */}
				<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 overflow-x-auto">
					<div className="flex items-center gap-2 mb-5">
						<Users className="text-emerald-600" width={20} height={20} />
						<h2 className="text-lg font-semibold text-gray-800">Membros</h2>
					</div>

					{loadingMembers ? (
						<p className="text-gray-500 text-sm">Carregando membros...</p>
					) : members.length === 0 ? (
						<p className="text-gray-500 text-sm">Nenhum membro cadastrado.</p>
					) : (
						<table className="min-w-full text-sm mb-6">
							<thead className="bg-gray-50 text-gray-600">
								<tr>
									<th className="text-left px-4 py-3 font-medium rounded-tl-lg">Email</th>
									<th className="text-left px-4 py-3 font-medium">Perfil</th>
									{isAdmin && <th className="px-4 py-3 rounded-tr-lg" />}
								</tr>
							</thead>
							<tbody>
								{members.map((member) => (
									<tr key={member.id} className="border-t hover:bg-gray-50 transition">
										<td className="px-4 py-3 text-gray-700">{member.email}</td>
										<td className="px-4 py-3">
											<span className={`px-2.5 py-1 rounded-full text-xs font-medium ${roleColor[member.role]}`}>
												{roleLabel[member.role]}
											</span>
										</td>
										{isAdmin && (
											<td className="px-4 py-3 text-right">
												{member.id !== user?.id && (
													<button
														onClick={() => setConfirm({ memberId: member.id, email: member.email })}
														disabled={loadingRemoveId === member.id}
														className="text-gray-400 hover:text-red-500 transition disabled:opacity-50 cursor-pointer"
														title="Remover membro"
													>
														<Trash2 width={16} height={16} />
													</button>
												)}
											</td>
										)}
									</tr>
								))}
							</tbody>
						</table>
					)}

					{isAdmin && (
						<>
							<div className="flex items-center gap-2 mb-3">
								<UserPlus className="text-emerald-600" width={18} height={18} />
								<h3 className="text-sm font-semibold text-gray-700">Convidar membro</h3>
							</div>
							<form onSubmit={handleInvite} className="flex gap-3">
								<input
									type="email"
									placeholder="email@exemplo.com"
									value={inviteEmail}
									onChange={(e) => setInviteEmail(e.target.value)}
									className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
									required
								/>
								<Button type="submit" className="w-auto px-5" disabled={loadingInvite}>
									{loadingInvite ? 'Enviando...' : 'Convidar'}
								</Button>
							</form>
						</>
					)}
				</div>
			</div>

			<ConfirmModal
				isOpen={!!confirm}
				title="Remover membro"
				message={`Deseja remover "${confirm?.email}" da clínica?`}
				confirmLabel="Remover"
				onConfirm={handleRemove}
				onClose={() => setConfirm(null)}
				loading={!!loadingRemoveId}
			/>
		</Layout>
	);
}
