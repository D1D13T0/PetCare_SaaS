import { Pencil, Plus, Shield, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import ConfirmModal from '../components/ui/ConfirmModal';
import Modal from '../components/ui/Modal';
import api from '../services/api';
import type { Vaccine } from '../types/vaccine';

const inputClass =
	'w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-emerald-500 focus:outline-none';

function formatDate(date?: string) {
	if (!date) return '-';
	return new Date(date).toLocaleDateString('pt-BR');
}

function isOverdue(date?: string) {
	if (!date) return false;
	return new Date(date) < new Date();
}

export function Vaccines() {
	const [petSearch, setPetSearch] = useState('');
	const [petId, setPetId] = useState('');
	const [petName, setPetName] = useState('');
	const [petResults, setPetResults] = useState<any[]>([]);
	const [petSearchLoading, setPetSearchLoading] = useState(false);

	const [vaccines, setVaccines] = useState<Vaccine[]>([]);
	const [loadingVaccines, setLoadingVaccines] = useState(false);

	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [editingVaccine, setEditingVaccine] = useState<Vaccine | null>(null);
	const [loadingCreate, setLoadingCreate] = useState(false);
	const [loadingEdit, setLoadingEdit] = useState(false);
	const [loadingDeleteId, setLoadingDeleteId] = useState<string | null>(null);
	const [confirmDelete, setConfirmDelete] = useState<{ id: string; name: string } | null>(null);

	const [vaccineName, setVaccineName] = useState('');
	const [applicationDate, setApplicationDate] = useState('');
	const [nextDoseDate, setNextDoseDate] = useState('');
	const [notes, setNotes] = useState('');

	useEffect(() => {
		const delay = setTimeout(() => {
			if (petSearch.length < 2 || petId) {
				setPetResults([]);
				return;
			}
			searchPets(petSearch);
		}, 300);
		return () => clearTimeout(delay);
	}, [petSearch, petId]);

	async function searchPets(query: string) {
		setPetSearchLoading(true);
		try {
			const response = await api.get('/pets', { params: { search: query } });
			setPetResults(response.data);
		} catch {
			toast.error('Erro ao buscar pets');
		} finally {
			setPetSearchLoading(false);
		}
	}

	async function loadVaccines(id: string) {
		setLoadingVaccines(true);
		try {
			const response = await api.get(`/vaccines/pet/${id}`);
			setVaccines(response.data);
		} catch {
			toast.error('Erro ao carregar vacinas');
		} finally {
			setLoadingVaccines(false);
		}
	}

	function selectPet(id: string, name: string) {
		setPetId(id);
		setPetName(name);
		setPetSearch(name);
		setPetResults([]);
		loadVaccines(id);
	}

	function clearPet() {
		setPetId('');
		setPetName('');
		setPetSearch('');
		setPetResults([]);
		setVaccines([]);
	}

	function resetForm() {
		setVaccineName('');
		setApplicationDate('');
		setNextDoseDate('');
		setNotes('');
	}

	function openEdit(vaccine: Vaccine) {
		setEditingVaccine(vaccine);
		setVaccineName(vaccine.name);
		setApplicationDate(vaccine.application_date.slice(0, 10));
		setNextDoseDate(vaccine.next_dose_date ? vaccine.next_dose_date.slice(0, 10) : '');
		setNotes(vaccine.notes ?? '');
		setIsEditOpen(true);
	}

	function closeEdit() {
		setIsEditOpen(false);
		setEditingVaccine(null);
		resetForm();
	}

	async function handleCreate(e: { preventDefault(): void }) {
		e.preventDefault();
		setLoadingCreate(true);
		try {
			const response = await api.post('/vaccines', {
				pet_id: petId,
				name: vaccineName,
				application_date: applicationDate,
				next_dose_date: nextDoseDate || undefined,
				notes: notes || undefined,
			});
			setVaccines((prev) => [response.data, ...prev]);
			toast.success('Vacina registrada com sucesso!');
			setIsCreateOpen(false);
			resetForm();
		} catch (err: any) {
			const msg = err?.response?.data?.message ?? 'Erro ao registrar vacina';
			toast.error(msg);
		} finally {
			setLoadingCreate(false);
		}
	}

	async function handleEdit(e: { preventDefault(): void }) {
		e.preventDefault();
		if (!editingVaccine) return;
		setLoadingEdit(true);
		try {
			const response = await api.put(`/vaccines/${editingVaccine.id}`, {
				name: vaccineName,
				application_date: applicationDate,
				next_dose_date: nextDoseDate || undefined,
				notes: notes || undefined,
			});
			setVaccines((prev) =>
				prev.map((v) => (v.id === editingVaccine.id ? response.data : v)),
			);
			toast.success('Vacina atualizada com sucesso!');
			closeEdit();
		} catch (err: any) {
			const msg = err?.response?.data?.message ?? 'Erro ao atualizar vacina';
			toast.error(msg);
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
			await api.delete(`/vaccines/${id}`);
			setVaccines((prev) => prev.filter((v) => v.id !== id));
			toast.success('Vacina excluída com sucesso!');
		} catch (err: any) {
			const msg = err?.response?.data?.message ?? 'Erro ao excluir vacina';
			toast.error(msg);
		} finally {
			setLoadingDeleteId(null);
		}
	}

	return (
		<Layout>
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
				<div>
					<h1 className="text-3xl font-semibold text-gray-800">Vacinas</h1>
					<p className="text-gray-500 text-sm">Histórico de vacinação por pet</p>
				</div>
				{petId && (
					<Button
						className="w-auto px-6 flex items-center gap-2"
						onClick={() => setIsCreateOpen(true)}
					>
						Registrar Vacina <Plus width={18} height={18} strokeWidth={3} />
					</Button>
				)}
			</div>

			{/* Seletor de pet */}
			<div className="relative mb-6 max-w-sm">
				<label className="text-sm font-medium text-gray-700">Pet</label>
				<div className="relative mt-1">
					<input
						type="text"
						placeholder="Busque pelo nome do pet..."
						value={petSearch}
						onChange={(e) => {
							setPetSearch(e.target.value);
							if (petId) clearPet();
						}}
						onBlur={() => setTimeout(() => { if (!petId) setPetSearch(''); }, 150)}
						className={inputClass}
					/>
					{petId && (
						<button
							onClick={clearPet}
							className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs cursor-pointer"
						>
							✕
						</button>
					)}
				</div>
				{petSearchLoading && (
					<div className="absolute right-3 top-9 text-xs text-gray-400">Buscando...</div>
				)}
				{petResults.length > 0 && (
					<div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow max-h-48 overflow-y-auto">
						{petResults.map((pet) => (
							<div
								key={pet.id}
								onMouseDown={(e) => {
									e.preventDefault();
									selectPet(pet.id, pet.name);
								}}
								className="px-3 py-2 hover:bg-emerald-50 cursor-pointer text-sm transition"
							>
								{pet.name}{' '}
								<span className="text-gray-400 text-xs">({pet.species})</span>
							</div>
						))}
					</div>
				)}
			</div>

			{/* Tabela de vacinas */}
			<div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
				{!petId ? (
					<div className="p-12 text-center flex flex-col items-center gap-3">
						<Shield className="text-gray-300" width={48} height={48} />
						<p className="text-gray-500">Selecione um pet para ver o histórico de vacinas.</p>
					</div>
				) : loadingVaccines ? (
					<div className="p-8 text-center text-gray-500">Carregando vacinas...</div>
				) : vaccines.length === 0 ? (
					<div className="p-12 text-center flex flex-col items-center gap-3">
						<Shield className="text-gray-300" width={48} height={48} />
						<p className="text-gray-500">Nenhuma vacina registrada para <strong>{petName}</strong>.</p>
					</div>
				) : (
					<table className="min-w-full text-sm">
						<thead className="bg-gray-50 text-gray-600">
							<tr>
								<th className="text-left px-8 py-4 font-medium">Vacina</th>
								<th className="text-left px-8 py-4 font-medium">Aplicação</th>
								<th className="text-left px-8 py-4 font-medium">Próxima dose</th>
								<th className="text-left px-8 py-4 font-medium">Observações</th>
								<th className="px-8 py-4" />
							</tr>
						</thead>
						<tbody>
							{vaccines.map((vaccine) => (
								<tr key={vaccine.id} className="border-t hover:bg-emerald-50 transition">
									<td className="px-8 py-4 font-semibold text-gray-800">{vaccine.name}</td>
									<td className="px-8 py-4 text-gray-600">{formatDate(vaccine.application_date)}</td>
									<td className="px-8 py-4">
										{vaccine.next_dose_date ? (
											<span className={isOverdue(vaccine.next_dose_date) ? 'text-red-600 font-medium' : 'text-gray-600'}>
												{formatDate(vaccine.next_dose_date)}
												{isOverdue(vaccine.next_dose_date) && ' · vencida'}
											</span>
										) : (
											<span className="text-gray-400">-</span>
										)}
									</td>
									<td className="px-8 py-4 text-gray-600 max-w-xs truncate">{vaccine.notes || '-'}</td>
									<td className="px-8 py-4">
										<div className="flex items-center justify-end gap-3">
											<button
												onClick={() => openEdit(vaccine)}
												className="text-gray-400 hover:text-emerald-600 transition cursor-pointer"
												title="Editar vacina"
											>
												<Pencil width={16} height={16} />
											</button>
											<button
												onClick={() => setConfirmDelete({ id: vaccine.id, name: vaccine.name })}
												disabled={loadingDeleteId === vaccine.id}
												className="text-gray-400 hover:text-red-500 transition disabled:opacity-50 cursor-pointer"
												title="Excluir vacina"
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

			{/* Modal: Registrar Vacina */}
			<Modal isOpen={isCreateOpen} onClose={() => { setIsCreateOpen(false); resetForm(); }}>
				<h2 className="text-xl font-semibold mb-1 text-gray-800">Registrar Vacina</h2>
				<p className="text-sm text-gray-500 mb-4">Pet: <span className="font-medium text-gray-700">{petName}</span></p>
				<form onSubmit={handleCreate} className="flex flex-col gap-4">
					<div>
						<label className="text-sm text-gray-600">Nome da vacina</label>
						<input type="text" value={vaccineName} onChange={(e) => setVaccineName(e.target.value)} className={inputClass} required />
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="text-sm text-gray-600">Data de aplicação</label>
							<input type="date" value={applicationDate} onChange={(e) => setApplicationDate(e.target.value)} className={inputClass} required />
						</div>
						<div>
							<label className="text-sm text-gray-600">Próxima dose</label>
							<input type="date" value={nextDoseDate} onChange={(e) => setNextDoseDate(e.target.value)} className={inputClass} />
						</div>
					</div>
					<div>
						<label className="text-sm text-gray-600">Observações</label>
						<textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className={`${inputClass} resize-none`} />
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
							{loadingCreate ? 'Salvando...' : 'Registrar'}
						</Button>
					</div>
				</form>
			</Modal>

			{/* Modal: Editar Vacina */}
			<Modal isOpen={isEditOpen} onClose={closeEdit}>
				<h2 className="text-xl font-semibold mb-1 text-gray-800">Editar Vacina</h2>
				<p className="text-sm text-gray-500 mb-4">Pet: <span className="font-medium text-gray-700">{petName}</span></p>
				<form onSubmit={handleEdit} className="flex flex-col gap-4">
					<div>
						<label className="text-sm text-gray-600">Nome da vacina</label>
						<input type="text" value={vaccineName} onChange={(e) => setVaccineName(e.target.value)} className={inputClass} required />
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="text-sm text-gray-600">Data de aplicação</label>
							<input type="date" value={applicationDate} onChange={(e) => setApplicationDate(e.target.value)} className={inputClass} required />
						</div>
						<div>
							<label className="text-sm text-gray-600">Próxima dose</label>
							<input type="date" value={nextDoseDate} onChange={(e) => setNextDoseDate(e.target.value)} className={inputClass} />
						</div>
					</div>
					<div>
						<label className="text-sm text-gray-600">Observações</label>
						<textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className={`${inputClass} resize-none`} />
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

			<ConfirmModal
				isOpen={!!confirmDelete}
				title="Excluir vacina"
				message={`Deseja excluir a vacina "${confirmDelete?.name}"?`}
				confirmLabel="Excluir"
				onConfirm={handleDelete}
				onClose={() => setConfirmDelete(null)}
				loading={!!loadingDeleteId}
			/>
		</Layout>
	);
}
