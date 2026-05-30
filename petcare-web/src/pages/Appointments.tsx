import { Ban, CalendarDays, CheckCircle, Plus, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import ConfirmModal from '../components/ui/ConfirmModal';
import Modal from '../components/ui/Modal';
import { useAppointments } from '../context/AppointmentContext';
import { useAuth } from '../context/AuthContext';
import { usePets } from '../context/PetContext';
import api from '../services/api';
import type { Appointment, AppointmentStatus, CompleteAppointmentDTO } from '../types/appointment';

const statusLabel: Record<AppointmentStatus, string> = {
	SCHEDULED: 'Agendado',
	CONFIRMED: 'Confirmado',
	CANCELLED: 'Cancelado',
	COMPLETED: 'Concluído',
};

const statusColor: Record<AppointmentStatus, string> = {
	SCHEDULED: 'bg-amber-100 text-amber-700',
	CONFIRMED: 'bg-blue-100 text-blue-700',
	CANCELLED: 'bg-red-100 text-red-700',
	COMPLETED: 'bg-emerald-100 text-emerald-700',
};

function formatDate(date: string) {
	return new Date(date).toLocaleString('pt-BR', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});
}

export function Appointments() {
	const { appointments, loading, hasMore, fetchAppointments, loadMore, createAppointment, completeAppointment, cancelAppointment } =
		useAppointments();
	const { pets, fetchPets } = usePets();
	const { user } = useAuth();

	// Filter state
	const [filterPetSearch, setFilterPetSearch] = useState('');
	const [filterPetId, setFilterPetId] = useState('');
	const [filterPetName, setFilterPetName] = useState('');
	const [filterPetResults, setFilterPetResults] = useState<any[]>([]);
	const [filterPetLoading, setFilterPetLoading] = useState(false);
	const now = new Date();
	const defaultStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
	const defaultEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().slice(0, 10);

	const [filterStart, setFilterStart] = useState(defaultStart);
	const [filterEnd, setFilterEnd] = useState(defaultEnd);

	// Create modal state
	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const [isCompleteOpen, setIsCompleteOpen] = useState(false);
	const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

	const [petSearch, setPetSearch] = useState('');
	const [petId, setPetId] = useState('');
	const [petResults, setPetResults] = useState<any[]>([]);
	const [petSearchLoading, setPetSearchLoading] = useState(false);
	const [date, setDate] = useState('');
	const [notes, setNotes] = useState('');
	const [valor, setValor] = useState('');
	const [loadingCreate, setLoadingCreate] = useState(false);

	const [diagnosis, setDiagnosis] = useState('');
	const [completeNotes, setCompleteNotes] = useState('');
	const [completeValor, setCompleteValor] = useState('');
	const [loadingComplete, setLoadingComplete] = useState(false);
	const [loadingCancelId, setLoadingCancelId] = useState<string | null>(null);
	const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);

	useEffect(() => {
		fetchAppointments({ start: defaultStart, end: defaultEnd });
		fetchPets();
	}, []);

	// Debounce for filter pet search
	useEffect(() => {
		const delay = setTimeout(() => {
			if (filterPetSearch.length < 2 || filterPetId) {
				setFilterPetResults([]);
				return;
			}
			searchFilterPets(filterPetSearch);
		}, 300);
		return () => clearTimeout(delay);
	}, [filterPetSearch, filterPetId]);

	// Debounce for create modal pet search
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

	async function searchFilterPets(query: string) {
		setFilterPetLoading(true);
		try {
			const response = await api.get('/pets', { params: { search: query } });
			setFilterPetResults(response.data);
		} catch {
			toast.error('Erro ao buscar pets');
		} finally {
			setFilterPetLoading(false);
		}
	}

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

	function selectFilterPet(id: string, name: string) {
		setFilterPetId(id);
		setFilterPetName(name);
		setFilterPetSearch(name);
		setFilterPetResults([]);
		fetchAppointments({
			pet_id: id,
			start: filterStart || undefined,
			end: filterEnd || undefined,
		});
	}

	function clearFilterPet() {
		setFilterPetId('');
		setFilterPetName('');
		setFilterPetSearch('');
		setFilterPetResults([]);
		fetchAppointments({
			start: filterStart || undefined,
			end: filterEnd || undefined,
		});
	}

	function applyFilters() {
		fetchAppointments({
			pet_id: filterPetId || undefined,
			start: filterStart || undefined,
			end: filterEnd || undefined,
		});
	}

	function clearFilters() {
		clearFilterPet();
		setFilterStart(defaultStart);
		setFilterEnd(defaultEnd);
		fetchAppointments({ start: defaultStart, end: defaultEnd });
	}

	const hasFilters = filterPetId || filterStart || filterEnd;

	function getPetName(id: string) {
		return pets.find((p) => p.id === id)?.name ?? id.slice(0, 8) + '...';
	}

	function resetCreate() {
		setPetSearch('');
		setPetId('');
		setPetResults([]);
		setDate('');
		setNotes('');
		setValor('');
	}

	function resetComplete() {
		setDiagnosis('');
		setCompleteNotes('');
		setCompleteValor('');
		setSelectedAppointment(null);
	}

	async function handleCreate(e: { preventDefault(): void }) {
		e.preventDefault();
		if (!petId) {
			toast.error('Selecione um pet');
			return;
		}
		setLoadingCreate(true);
		try {
			await createAppointment({
				pet_id: petId,
				veterinarian_id: user.id,
				date,
				notes: notes || undefined,
				valor: valor ? Number(valor) : undefined,
			});
			toast.success('Consulta agendada com sucesso!');
			setIsCreateOpen(false);
			resetCreate();
		} catch (err: any) {
			const msg = err?.response?.data?.message ?? 'Erro ao agendar consulta';
			toast.error(msg);
		} finally {
			setLoadingCreate(false);
		}
	}

	async function handleComplete(e: { preventDefault(): void }) {
		e.preventDefault();
		if (!selectedAppointment) return;
		setLoadingComplete(true);
		try {
			const data: CompleteAppointmentDTO = {
				diagnosis,
				notes: completeNotes || undefined,
				valor: completeValor ? Number(completeValor) : undefined,
			};
			await completeAppointment(selectedAppointment.id, data);
			toast.success('Consulta concluída!');
			setIsCompleteOpen(false);
			resetComplete();
		} catch (err: any) {
			const msg = err?.response?.data?.message ?? 'Erro ao concluir consulta';
			toast.error(msg);
		} finally {
			setLoadingComplete(false);
		}
	}

	async function handleCancel() {
		if (!confirmCancelId) return;
		const id = confirmCancelId;
		setConfirmCancelId(null);
		setLoadingCancelId(id);
		try {
			await cancelAppointment(id);
			toast.success('Consulta cancelada');
		} catch (err: any) {
			toast.error(err?.response?.data?.message ?? 'Erro ao cancelar consulta');
		} finally {
			setLoadingCancelId(null);
		}
	}

	function openComplete(appointment: Appointment) {
		setSelectedAppointment(appointment);
		setDiagnosis(appointment.diagnosis ?? '');
		setCompleteNotes(appointment.notes ?? '');
		setIsCompleteOpen(true);
	}

	return (
		<Layout>
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
				<div>
					<h1 className="text-3xl font-semibold text-gray-800">Consultas</h1>
					<p className="text-gray-500 text-sm">Gerencie as consultas da sua clínica</p>
				</div>
				<Button
					className="w-auto px-6 flex items-center gap-2"
					onClick={() => setIsCreateOpen(true)}
				>
					Nova Consulta <Plus width={18} height={18} strokeWidth={3} />
				</Button>
			</div>

			{/* Filter bar */}
			<div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4 flex flex-wrap items-end gap-4">
				<div className="relative flex-1 min-w-48">
					<label className="text-xs font-medium text-gray-600 block mb-1">Pet</label>
					<div className="relative">
						<input
							type="text"
							placeholder="Buscar por pet..."
							value={filterPetSearch}
							onChange={(e) => {
								setFilterPetSearch(e.target.value);
								if (filterPetId) clearFilterPet();
							}}
							onBlur={() => setTimeout(() => { if (!filterPetId) setFilterPetSearch(''); }, 150)}
							className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
						/>
						{filterPetId && (
							<button
								onClick={clearFilterPet}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
							>
								<X width={14} height={14} />
							</button>
						)}
						{filterPetLoading && (
							<div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">...</div>
						)}
					</div>
					{filterPetResults.length > 0 && (
						<div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow max-h-48 overflow-y-auto">
							{filterPetResults.map((pet) => (
								<div
									key={pet.id}
									onMouseDown={(e) => {
										e.preventDefault();
										selectFilterPet(pet.id, pet.name);
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

				<div className="w-full sm:w-auto">
					<label className="text-xs font-medium text-gray-600 block mb-1">De</label>
					<input
						type="date"
						value={filterStart}
						onChange={(e) => setFilterStart(e.target.value)}
						className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
					/>
				</div>

				<div className="w-full sm:w-auto">
					<label className="text-xs font-medium text-gray-600 block mb-1">Até</label>
					<input
						type="date"
						value={filterEnd}
						onChange={(e) => setFilterEnd(e.target.value)}
						className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
					/>
				</div>

				<div className="flex gap-2">
					<Button className="w-auto px-4 py-2 text-sm" onClick={applyFilters}>
						Filtrar
					</Button>
					{hasFilters && (
						<button
							onClick={clearFilters}
							className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 text-sm transition cursor-pointer flex items-center gap-1"
						>
							<X width={14} height={14} /> Limpar
						</button>
					)}
				</div>
			</div>

			{hasFilters && (
				<p className="text-xs text-gray-500 mb-3">
					{filterPetName && <span>Pet: <strong>{filterPetName}</strong>{(filterStart || filterEnd) ? ' · ' : ''}</span>}
					{filterStart && <span>De: <strong>{new Date(filterStart).toLocaleDateString('pt-BR')}</strong>{filterEnd ? ' · ' : ''}</span>}
					{filterEnd && <span>Até: <strong>{new Date(filterEnd).toLocaleDateString('pt-BR')}</strong></span>}
				</p>
			)}

			<div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
				{loading ? (
					<div className="p-8 text-center text-gray-500">Carregando consultas...</div>
				) : appointments.length === 0 ? (
					<div className="p-12 text-center flex flex-col items-center gap-3">
						<CalendarDays className="text-gray-300" width={48} height={48} />
						<p className="text-gray-500">Nenhuma consulta encontrada.</p>
					</div>
				) : (
					<table className="min-w-full text-sm">
						<thead className="bg-gray-50 text-gray-600">
							<tr>
								<th className="text-left px-8 py-4 font-medium">Data</th>
								<th className="text-left px-8 py-4 font-medium">Pet</th>
								<th className="text-left px-8 py-4 font-medium">Status</th>
								<th className="px-8 py-4" />
							</tr>
						</thead>
						<tbody>
							{appointments.map((appointment) => (
								<tr key={appointment.id} className="border-t hover:bg-emerald-50 transition">
									<td className="px-8 py-4 text-gray-700">{formatDate(appointment.date)}</td>
									<td className="px-8 py-4 font-semibold text-gray-800">
										{getPetName(appointment.pet_id)}
									</td>
									<td className="px-8 py-4">
										<span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor[appointment.status]}`}>
											{statusLabel[appointment.status]}
										</span>
									</td>
									<td className="px-8 py-4 text-right">
										{(appointment.status === 'SCHEDULED' || appointment.status === 'CONFIRMED') && (
											<div className="flex items-center justify-end gap-3">
												<button
													onClick={() => openComplete(appointment)}
													className="flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-800 font-medium transition cursor-pointer"
												>
													<CheckCircle width={14} height={14} />
													Concluir
												</button>
												<button
													onClick={() => setConfirmCancelId(appointment.id)}
													disabled={loadingCancelId === appointment.id}
													className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 font-medium transition cursor-pointer disabled:opacity-50"
												>
													<Ban width={14} height={14} />
													Cancelar
												</button>
											</div>
										)}
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
				isOpen={!!confirmCancelId}
				title="Cancelar consulta"
				message="Deseja cancelar esta consulta? Esta ação não pode ser desfeita."
				confirmLabel="Cancelar consulta"
				variant="warning"
				onConfirm={handleCancel}
				onClose={() => setConfirmCancelId(null)}
				loading={!!loadingCancelId}
			/>

			{/* Modal: Nova Consulta */}
			<Modal isOpen={isCreateOpen} onClose={() => { setIsCreateOpen(false); resetCreate(); }}>
				<h2 className="text-xl font-semibold mb-4 text-gray-800">Nova Consulta</h2>
				<form onSubmit={handleCreate} className="flex flex-col gap-4">
					<div className="relative">
						<label className="text-sm text-gray-600">Pet</label>
						<input
							type="text"
							placeholder="Digite para buscar..."
							value={petSearch}
							onChange={(e) => { setPetSearch(e.target.value); setPetId(''); }}
							onBlur={() => setTimeout(() => setPetResults([]), 150)}
							className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
						/>
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
											setPetId(pet.id);
											setPetSearch(pet.name);
											setPetResults([]);
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

					<div>
						<label className="text-sm text-gray-600">Data e hora</label>
						<input
							type="datetime-local"
							value={date}
							onChange={(e) => setDate(e.target.value)}
							className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
							required
						/>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="text-sm text-gray-600">Valor (R$)</label>
							<input
								type="number"
								min="0"
								step="0.01"
								value={valor}
								onChange={(e) => setValor(e.target.value)}
								placeholder="0,00"
								className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
							/>
						</div>
					</div>

					<div>
						<label className="text-sm text-gray-600">Observações</label>
						<textarea
							value={notes}
							onChange={(e) => setNotes(e.target.value)}
							rows={3}
							className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none"
						/>
					</div>

					<div className="flex justify-end gap-3 mt-2">
						<button
							type="button"
							onClick={() => { setIsCreateOpen(false); resetCreate(); }}
							className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition cursor-pointer"
						>
							Cancelar
						</button>
						<Button type="submit" disabled={loadingCreate}>
							{loadingCreate ? 'Agendando...' : 'Agendar'}
						</Button>
					</div>
				</form>
			</Modal>

			{/* Modal: Concluir Consulta */}
			<Modal isOpen={isCompleteOpen} onClose={() => { setIsCompleteOpen(false); resetComplete(); }}>
				<h2 className="text-xl font-semibold mb-1 text-gray-800">Concluir Consulta</h2>
				{selectedAppointment && (
					<p className="text-sm text-gray-500 mb-4">
						Pet: <span className="font-medium text-gray-700">{getPetName(selectedAppointment.pet_id)}</span>
						{' · '}
						{formatDate(selectedAppointment.date)}
					</p>
				)}
				<form onSubmit={handleComplete} className="flex flex-col gap-4">
					<div>
						<label className="text-sm text-gray-600">Valor (R$)</label>
						<input
							type="number"
							min="0"
							step="0.01"
							value={completeValor}
							onChange={(e) => setCompleteValor(e.target.value)}
							placeholder="0,00"
							className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
						/>
					</div>
					<div>
						<label className="text-sm text-gray-600">Diagnóstico</label>
						<textarea
							value={diagnosis}
							onChange={(e) => setDiagnosis(e.target.value)}
							rows={3}
							className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none"
							required
						/>
					</div>
					<div>
						<label className="text-sm text-gray-600">Observações</label>
						<textarea
							value={completeNotes}
							onChange={(e) => setCompleteNotes(e.target.value)}
							rows={2}
							className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none"
						/>
					</div>
					<div className="flex justify-end gap-3 mt-2">
						<button
							type="button"
							onClick={() => { setIsCompleteOpen(false); resetComplete(); }}
							className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition cursor-pointer"
						>
							Cancelar
						</button>
						<Button type="submit" disabled={loadingComplete}>
							{loadingComplete ? 'Salvando...' : 'Concluir'}
						</Button>
					</div>
				</form>
			</Modal>
		</Layout>
	);
}
