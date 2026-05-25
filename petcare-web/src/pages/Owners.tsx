import { Pencil, Plus, Search, Trash2, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { useOwners } from '../context/OwnerContext';
import type { Owner } from '../types/owner';

const inputClass =
	'w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-emerald-500 focus:outline-none';

export function Owners() {
	const { owners, loading, fetchOwners, createOwner, updateOwner, deleteOwner } = useOwners();
	const [search, setSearch] = useState('');

	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [editingOwner, setEditingOwner] = useState<Owner | null>(null);
	const [loadingCreate, setLoadingCreate] = useState(false);
	const [loadingEdit, setLoadingEdit] = useState(false);
	const [loadingDeleteId, setLoadingDeleteId] = useState<string | null>(null);

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [phone, setPhone] = useState('');
	const [document, setDocument] = useState('');

	useEffect(() => {
		fetchOwners();
	}, []);

	useEffect(() => {
		const delay = setTimeout(() => {
			fetchOwners(search || undefined);
		}, 300);
		return () => clearTimeout(delay);
	}, [search]);

	function resetForm() {
		setName('');
		setEmail('');
		setPhone('');
		setDocument('');
	}

	function openEdit(owner: Owner) {
		setEditingOwner(owner);
		setName(owner.name);
		setEmail(owner.email);
		setPhone(owner.phone);
		setDocument(owner.document);
		setIsEditOpen(true);
	}

	function closeEdit() {
		setIsEditOpen(false);
		setEditingOwner(null);
		resetForm();
	}

	async function handleCreate(e: { preventDefault(): void }) {
		e.preventDefault();
		setLoadingCreate(true);
		try {
			await createOwner({ name, email, phone, document });
			toast.success('Dono cadastrado com sucesso!');
			setIsCreateOpen(false);
			resetForm();
		} catch {
			toast.error('Erro ao cadastrar dono');
		} finally {
			setLoadingCreate(false);
		}
	}

	async function handleEdit(e: { preventDefault(): void }) {
		e.preventDefault();
		if (!editingOwner) return;
		setLoadingEdit(true);
		try {
			await updateOwner(editingOwner.id, { name, email, phone, document });
			toast.success('Dono atualizado com sucesso!');
			closeEdit();
		} catch {
			toast.error('Erro ao atualizar dono');
		} finally {
			setLoadingEdit(false);
		}
	}

	async function handleDelete(id: string, ownerName: string) {
		if (!confirm(`Deseja excluir o dono "${ownerName}"?`)) return;
		setLoadingDeleteId(id);
		try {
			await deleteOwner(id);
			toast.success('Dono excluído com sucesso!');
		} catch (err: any) {
			const msg = err?.response?.data?.message ?? err?.message ?? 'Erro ao excluir dono';
			toast.error(msg);
		} finally {
			setLoadingDeleteId(null);
		}
	}

	return (
		<Layout>
			<div className="flex items-center justify-between mb-8">
				<div>
					<h1 className="text-3xl font-semibold text-gray-800">Donos</h1>
					<p className="text-gray-500 text-sm">Gerencie os donos de pets da sua clínica</p>
				</div>
				<Button
					className="w-auto px-6 flex items-center gap-2"
					onClick={() => setIsCreateOpen(true)}
				>
					Novo Dono <Plus width={18} height={18} strokeWidth={3} />
				</Button>
			</div>

			<div className="mb-4 relative">
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width={16} height={16} />
				<input
					type="text"
					placeholder="Buscar por nome, e-mail ou documento..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="w-full border border-gray-300 rounded-lg pl-9 pr-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
				/>
			</div>

			<div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
				{loading ? (
					<div className="p-8 text-center text-gray-500">Carregando donos...</div>
				) : owners.length === 0 ? (
					<div className="p-12 text-center flex flex-col items-center gap-3">
						<User className="text-gray-300" width={48} height={48} />
						<p className="text-gray-500">Nenhum dono cadastrado ainda.</p>
					</div>
				) : (
					<table className="w-full text-sm">
						<thead className="bg-gray-50 text-gray-600">
							<tr>
								<th className="text-left px-8 py-4 font-medium">Nome</th>
								<th className="text-left px-8 py-4 font-medium">E-mail</th>
								<th className="text-left px-8 py-4 font-medium">Telefone</th>
								<th className="text-left px-8 py-4 font-medium">Documento</th>
								<th className="px-8 py-4" />
							</tr>
						</thead>
						<tbody>
							{owners.map((owner) => (
								<tr key={owner.id} className="border-t hover:bg-emerald-50 transition">
									<td className="px-8 py-4 font-semibold text-gray-800">{owner.name}</td>
									<td className="px-8 py-4 text-gray-600">{owner.email}</td>
									<td className="px-8 py-4 text-gray-600">{owner.phone}</td>
									<td className="px-8 py-4 text-gray-600">{owner.document}</td>
									<td className="px-8 py-4">
										<div className="flex items-center justify-end gap-3">
											<button
												onClick={() => openEdit(owner)}
												className="text-gray-400 hover:text-emerald-600 transition cursor-pointer"
												title="Editar dono"
											>
												<Pencil width={16} height={16} />
											</button>
											<button
												onClick={() => handleDelete(owner.id, owner.name)}
												disabled={loadingDeleteId === owner.id}
												className="text-gray-400 hover:text-red-500 transition disabled:opacity-50 cursor-pointer"
												title="Excluir dono"
											>
												<Trash2 width={16} height={16} />
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				)}
			</div>

			{/* Modal: Novo Dono */}
			<Modal isOpen={isCreateOpen} onClose={() => { setIsCreateOpen(false); resetForm(); }}>
				<h2 className="text-xl font-semibold mb-4 text-gray-800">Novo Dono</h2>
				<form onSubmit={handleCreate} className="flex flex-col gap-4">
					<div>
						<label className="text-sm text-gray-600">Nome completo</label>
						<input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} required />
					</div>
					<div>
						<label className="text-sm text-gray-600">E-mail</label>
						<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} required />
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="text-sm text-gray-600">Telefone</label>
							<input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} required />
						</div>
						<div>
							<label className="text-sm text-gray-600">CPF / Documento</label>
							<input type="text" value={document} onChange={(e) => setDocument(e.target.value)} className={inputClass} required />
						</div>
					</div>
					<div className="flex justify-end gap-3 mt-2">
						<button
							type="button"
							onClick={() => { setIsCreateOpen(false); resetForm(); }}
							className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition cursor-pointer"
						>
							Cancelar
						</button>
						<Button type="submit" disabled={loadingCreate}>
							{loadingCreate ? 'Salvando...' : 'Salvar'}
						</Button>
					</div>
				</form>
			</Modal>

			{/* Modal: Editar Dono */}
			<Modal isOpen={isEditOpen} onClose={closeEdit}>
				<h2 className="text-xl font-semibold mb-4 text-gray-800">Editar Dono</h2>
				<form onSubmit={handleEdit} className="flex flex-col gap-4">
					<div>
						<label className="text-sm text-gray-600">Nome completo</label>
						<input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} required />
					</div>
					<div>
						<label className="text-sm text-gray-600">E-mail</label>
						<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} required />
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="text-sm text-gray-600">Telefone</label>
							<input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} required />
						</div>
						<div>
							<label className="text-sm text-gray-600">CPF / Documento</label>
							<input type="text" value={document} onChange={(e) => setDocument(e.target.value)} className={inputClass} required />
						</div>
					</div>
					<div className="flex justify-end gap-3 mt-2">
						<button
							type="button"
							onClick={closeEdit}
							className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition cursor-pointer"
						>
							Cancelar
						</button>
						<Button type="submit" disabled={loadingEdit}>
							{loadingEdit ? 'Salvando...' : 'Salvar'}
						</Button>
					</div>
				</form>
			</Modal>
		</Layout>
	);
}
