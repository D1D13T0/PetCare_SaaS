import { ClipboardList, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import ConfirmModal from '../components/ui/ConfirmModal';
import Modal from '../components/ui/Modal';
import { usePets } from '../context/PetContext';
import api from '../services/api';

interface Pet {
	id: string;
	name: string;
	species: string;
	breed?: string;
	sex?: 'M' | 'F';
	weight?: number;
	birth_date?: string;
	owner_id?: string;
}

const sexLabel: Record<string, string> = { M: 'Macho', F: 'Fêmea' };

function formatDate(date?: string) {
	if (!date) return '-';
	return new Date(date).toLocaleDateString('pt-BR');
}

const inputClass =
	'w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-emerald-500 focus:outline-none';

export default function Pets() {
	const { pets, loading, hasMore, fetchPets, loadMore, createPet, updatePet, deletePet } = usePets();

	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [editingPet, setEditingPet] = useState<Pet | null>(null);
	const [loadingCreate, setLoadingCreate] = useState(false);
	const [loadingEdit, setLoadingEdit] = useState(false);
	const [loadingDeleteId, setLoadingDeleteId] = useState<string | null>(null);
	const [confirmDelete, setConfirmDelete] = useState<{ id: string; name: string } | null>(null);
	const [search, setSearch] = useState('');

	const [name, setName] = useState('');
	const [species, setSpecies] = useState('');
	const [breed, setBreed] = useState('');
	const [sex, setSex] = useState<'M' | 'F' | ''>('');
	const [weight, setWeight] = useState('');
	const [birthDate, setBirthDate] = useState('');
	const [ownerSearch, setOwnerSearch] = useState('');
	const [owners, setOwners] = useState<any[]>([]);
	const [ownerId, setOwnerId] = useState('');
	const [searchLoading, setSearchLoading] = useState(false);

	useEffect(() => {
		fetchPets();
	}, []);

	useEffect(() => {
		const delay = setTimeout(() => {
			fetchPets(search || undefined);
		}, 300);
		return () => clearTimeout(delay);
	}, [search]);

	useEffect(() => {
		const delayDebounce = setTimeout(() => {
			if (ownerSearch.length < 2 || ownerId) {
				setOwners([]);
				return;
			}
			searchOwners(ownerSearch);
		}, 300);
		return () => clearTimeout(delayDebounce);
	}, [ownerSearch, ownerId]);

	async function searchOwners(query: string) {
		try {
			setSearchLoading(true);
			const response = await api.get('/owners', { params: { search: query } });
			setOwners(response.data);
		} catch {
			toast.error('Erro ao buscar donos');
		} finally {
			setSearchLoading(false);
		}
	}

	function resetForm() {
		setName('');
		setSpecies('');
		setBreed('');
		setSex('');
		setWeight('');
		setBirthDate('');
		setOwnerId('');
		setOwnerSearch('');
	}

	function openEdit(pet: Pet) {
		setEditingPet(pet);
		setName(pet.name);
		setSpecies(pet.species);
		setBreed(pet.breed ?? '');
		setSex(pet.sex ?? '');
		setWeight(pet.weight?.toString() ?? '');
		setBirthDate(pet.birth_date ? pet.birth_date.slice(0, 10) : '');
		setIsEditOpen(true);
	}

	function closeEdit() {
		setIsEditOpen(false);
		setEditingPet(null);
		resetForm();
	}

	async function handleCreate(e: { preventDefault(): void }) {
		e.preventDefault();
		setLoadingCreate(true);
		try {
			await createPet({
				name,
				species,
				breed: breed || undefined,
				sex: sex || undefined,
				weight: weight ? parseFloat(weight) : undefined,
				birth_date: birthDate || undefined,
				owner_id: ownerId,
			});
			toast.success('Pet criado com sucesso!');
			setIsCreateOpen(false);
			resetForm();
		} catch {
			toast.error('Erro ao criar pet');
		} finally {
			setLoadingCreate(false);
		}
	}

	async function handleEdit(e: { preventDefault(): void }) {
		e.preventDefault();
		if (!editingPet) return;
		setLoadingEdit(true);
		try {
			await updatePet(editingPet.id, {
				name,
				species,
				breed: breed || undefined,
				sex: sex || undefined,
				weight: weight ? parseFloat(weight) : undefined,
				birth_date: birthDate || undefined,
			});
			toast.success('Pet atualizado com sucesso!');
			closeEdit();
		} catch {
			toast.error('Erro ao atualizar pet');
		} finally {
			setLoadingEdit(false);
		}
	}

	async function handleDelete() {
		if (!confirmDelete) return;
		const { id } = confirmDelete;
		setConfirmDelete(null);
		setLoadingDeleteId(id);
		try {
			await deletePet(id);
			toast.success('Pet excluído com sucesso!');
		} catch (err: any) {
			const msg = err?.response?.data?.message ?? err?.message ?? 'Erro ao excluir pet';
			toast.error(msg);
		} finally {
			setLoadingDeleteId(null);
		}
	}

	return (
		<Layout>
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
				<div>
					<h1 className="text-3xl font-semibold text-gray-800">Pets</h1>
					<p className="text-gray-500 text-sm">Gerencie os pets da sua clínica</p>
				</div>
				<Button
					className="w-auto px-6 flex items-center gap-2"
					onClick={() => setIsCreateOpen(true)}
				>
					Novo Pet <Plus width={18} height={18} strokeWidth={3} />
				</Button>
			</div>

			<div className="relative mb-4 max-w-sm">
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width={16} height={16} />
				<input
					type="text"
					placeholder="Buscar por nome..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
				/>
			</div>

			<div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
				{loading ? (
					<div className="p-8 text-center text-gray-500">Carregando pets...</div>
				) : pets.length === 0 ? (
					<div className="p-12 text-center">
						<p className="text-gray-500">Nenhum pet cadastrado ainda.</p>
					</div>
				) : (
					<table className="min-w-full text-sm">
						<thead className="bg-gray-50 text-gray-600">
							<tr>
								<th className="text-left px-8 py-4 font-medium">Nome</th>
								<th className="text-left px-8 py-4 font-medium">Espécie</th>
								<th className="text-left px-8 py-4 font-medium">Raça</th>
								<th className="text-left px-8 py-4 font-medium">Sexo</th>
								<th className="text-left px-8 py-4 font-medium">Peso</th>
								<th className="text-left px-8 py-4 font-medium">Nascimento</th>
								<th className="px-8 py-4" />
							</tr>
						</thead>
						<tbody>
							{pets.map((pet) => (
								<tr key={pet.id} className="border-t hover:bg-emerald-50 transition">
									<td className="px-8 py-4 font-semibold text-gray-800">{pet.name}</td>
									<td className="px-8 py-4 text-gray-600">{pet.species}</td>
									<td className="px-8 py-4 text-gray-600">{pet.breed || '-'}</td>
									<td className="px-8 py-4 text-gray-600">{pet.sex ? sexLabel[pet.sex] : '-'}</td>
									<td className="px-8 py-4 text-gray-600">{pet.weight ? `${pet.weight} kg` : '-'}</td>
									<td className="px-8 py-4 text-gray-600">{formatDate(pet.birth_date)}</td>
									<td className="px-8 py-4">
										<div className="flex items-center justify-end gap-3">
											<Link
												to={`/pets/${pet.id}`}
												className="text-gray-400 hover:text-blue-500 transition cursor-pointer"
												title="Histórico médico"
											>
												<ClipboardList width={16} height={16} />
											</Link>
											<button
												onClick={() => openEdit(pet)}
												className="text-gray-400 hover:text-emerald-600 transition cursor-pointer"
												title="Editar pet"
											>
												<Pencil width={16} height={16} />
											</button>
											<button
												onClick={() => setConfirmDelete({ id: pet.id, name: pet.name })}
												disabled={loadingDeleteId === pet.id}
												className="text-gray-400 hover:text-red-500 transition disabled:opacity-50 cursor-pointer"
												title="Excluir pet"
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

			{hasMore && (
				<div className="flex justify-center mt-4">
					<button
						onClick={loadMore}
						disabled={loading}
						className="px-6 py-2 text-sm font-medium text-emerald-600 border border-emerald-300 rounded-lg hover:bg-emerald-50 transition cursor-pointer disabled:opacity-50"
					>
						{loading ? 'Carregando...' : 'Carregar mais'}
					</button>
				</div>
			)}

			<ConfirmModal
				isOpen={!!confirmDelete}
				title="Excluir pet"
				message={`Deseja excluir o pet "${confirmDelete?.name}"?`}
				confirmLabel="Excluir"
				onConfirm={handleDelete}
				onClose={() => setConfirmDelete(null)}
				loading={!!loadingDeleteId}
			/>

			{/* Modal: Novo Pet */}
			<Modal isOpen={isCreateOpen} onClose={() => { setIsCreateOpen(false); resetForm(); }}>
				<h2 className="text-xl font-semibold mb-4 text-gray-800">Novo Pet</h2>
				<form onSubmit={handleCreate} className="flex flex-col gap-4">
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="text-sm text-gray-600">Nome</label>
							<input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} required />
						</div>
						<div>
							<label className="text-sm text-gray-600">Espécie</label>
							<input type="text" value={species} onChange={(e) => setSpecies(e.target.value)} className={inputClass} required />
						</div>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="text-sm text-gray-600">Raça</label>
							<input type="text" value={breed} onChange={(e) => setBreed(e.target.value)} className={inputClass} />
						</div>
						<div>
							<label className="text-sm text-gray-600">Sexo</label>
							<select value={sex} onChange={(e) => setSex(e.target.value as 'M' | 'F' | '')} className={`${inputClass} bg-white`}>
								<option value="">Selecione</option>
								<option value="M">Macho</option>
								<option value="F">Fêmea</option>
							</select>
						</div>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="text-sm text-gray-600">Peso (kg)</label>
							<input type="number" step="0.1" min="0" value={weight} onChange={(e) => setWeight(e.target.value)} className={inputClass} />
						</div>
						<div>
							<label className="text-sm text-gray-600">Data de nascimento</label>
							<input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className={inputClass} />
						</div>
					</div>
					<div className="relative">
						<label className="text-sm text-gray-600">Dono</label>
						<input
							type="text"
							placeholder="Digite para buscar..."
							value={ownerSearch}
							onChange={(e) => { setOwnerSearch(e.target.value); setOwnerId(''); }}
							onBlur={() => setTimeout(() => setOwners([]), 150)}
							className={inputClass}
							required
						/>
						{searchLoading && (
							<div className="absolute right-3 top-9 text-xs text-gray-400">Buscando...</div>
						)}
						{owners.length > 0 && (
							<div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow max-h-48 overflow-y-auto">
								{owners.map((owner) => (
									<div
										key={owner.id}
										onMouseDown={(e) => {
											e.preventDefault();
											setOwnerId(owner.id);
											setOwnerSearch(owner.name);
											setOwners([]);
										}}
										className="px-3 py-2 hover:bg-emerald-50 cursor-pointer text-sm transition"
									>
										{owner.name}
									</div>
								))}
							</div>
						)}
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
							{loadingCreate ? 'Criando...' : 'Salvar'}
						</Button>
					</div>
				</form>
			</Modal>

			{/* Modal: Editar Pet */}
			<Modal isOpen={isEditOpen} onClose={closeEdit}>
				<h2 className="text-xl font-semibold mb-4 text-gray-800">Editar Pet</h2>
				<form onSubmit={handleEdit} className="flex flex-col gap-4">
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="text-sm text-gray-600">Nome</label>
							<input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} required />
						</div>
						<div>
							<label className="text-sm text-gray-600">Espécie</label>
							<input type="text" value={species} onChange={(e) => setSpecies(e.target.value)} className={inputClass} required />
						</div>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="text-sm text-gray-600">Raça</label>
							<input type="text" value={breed} onChange={(e) => setBreed(e.target.value)} className={inputClass} />
						</div>
						<div>
							<label className="text-sm text-gray-600">Sexo</label>
							<select value={sex} onChange={(e) => setSex(e.target.value as 'M' | 'F' | '')} className={`${inputClass} bg-white`}>
								<option value="">Selecione</option>
								<option value="M">Macho</option>
								<option value="F">Fêmea</option>
							</select>
						</div>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="text-sm text-gray-600">Peso (kg)</label>
							<input type="number" step="0.1" min="0" value={weight} onChange={(e) => setWeight(e.target.value)} className={inputClass} />
						</div>
						<div>
							<label className="text-sm text-gray-600">Data de nascimento</label>
							<input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className={inputClass} />
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
