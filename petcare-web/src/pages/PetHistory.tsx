import { ArrowLeft, CalendarDays, ChevronLeft, ChevronRight, FileDown, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { generatePetPDF } from '../lib/pdf';
import api from '../services/api';

interface Owner { id: string; name: string; phone?: string; email?: string; }
interface Pet {
	id: string; name: string; species: string; breed?: string;
	sex?: 'M' | 'F'; weight?: number; birth_date?: string; owner: Owner;
}
interface Appointment {
	id: string; date: string; status: string; diagnosis?: string; notes?: string;
}
interface Vaccine {
	id: string; name: string; application_date: string; next_dose_date?: string; notes?: string;
}

const MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const sexLabel: Record<string, string> = { M: 'Macho', F: 'Fêmea' };
const statusLabel: Record<string, string> = {
	SCHEDULED: 'Agendado', CONFIRMED: 'Confirmado',
	CANCELLED: 'Cancelado', COMPLETED: 'Concluído',
};
const statusColor: Record<string, string> = {
	SCHEDULED: 'bg-amber-100 text-amber-700', CONFIRMED: 'bg-blue-100 text-blue-700',
	CANCELLED: 'bg-red-100 text-red-700', COMPLETED: 'bg-emerald-100 text-emerald-700',
};

function formatDate(date?: string) {
	if (!date) return '—';
	return new Date(date).toLocaleDateString('pt-BR');
}
function formatDateTime(date: string) {
	return new Date(date).toLocaleString('pt-BR', {
		day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
	});
}

export default function PetHistory() {
	const { id } = useParams<{ id: string }>();

	const now = new Date();
	const [year, setYear] = useState(now.getFullYear());
	const [month, setMonth] = useState(now.getMonth());

	const [pet, setPet] = useState<Pet | null>(null);
	const [appointments, setAppointments] = useState<Appointment[]>([]);
	const [vaccines, setVaccines] = useState<Vaccine[]>([]);
	const [loadingPet, setLoadingPet] = useState(true);
	const [loadingHistory, setLoadingHistory] = useState(false);

	useEffect(() => {
		if (!id) return;
		fetchPet();
	}, [id]);

	useEffect(() => {
		if (!id) return;
		fetchHistory();
	}, [id, month, year]);

	async function fetchPet() {
		try {
			const res = await api.get(`/pets/${id}`);
			setPet(res.data);
		} catch {
			toast.error('Erro ao carregar dados do pet');
		} finally {
			setLoadingPet(false);
		}
	}

	async function fetchHistory() {
		setLoadingHistory(true);
		try {
			const start = new Date(year, month, 1).toISOString();
			const end = new Date(year, month + 1, 0, 23, 59, 59).toISOString();

			const [apptRes, vaccRes] = await Promise.all([
				api.get(`/appointments/pet/${id}`, { params: { start, end } }),
				api.get(`/vaccines/pet/${id}`, { params: { start, end } }),
			]);
			setAppointments(apptRes.data);
			setVaccines(vaccRes.data);
		} catch {
			toast.error('Erro ao carregar histórico');
		} finally {
			setLoadingHistory(false);
		}
	}

	function prevMonth() {
		if (month === 0) { setMonth(11); setYear(y => y - 1); }
		else setMonth(m => m - 1);
	}

	function nextMonth() {
		if (month === 11) { setMonth(0); setYear(y => y + 1); }
		else setMonth(m => m + 1);
	}

	const isCurrentMonth = month === now.getMonth() && year === now.getFullYear();

	if (loadingPet) return <Layout><div className="p-8 text-gray-500">Carregando...</div></Layout>;
	if (!pet) return <Layout><div className="p-8 text-gray-500">Pet não encontrado.</div></Layout>;

	return (
		<Layout>
			<div className="p-8 max-w-4xl">

				{/* Topo */}
				<div className="flex items-center justify-between mb-6">
					<Link to="/pets" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition">
						<ArrowLeft width={16} height={16} /> Voltar para Pets
					</Link>
					<div className="flex items-center gap-2">
						<button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-gray-100 transition cursor-pointer text-gray-500">
							<ChevronLeft width={18} height={18} />
						</button>
						<span className="text-sm font-medium text-gray-700 w-36 text-center">
							{MONTHS[month]} {year}
						</span>
						<button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-gray-100 transition cursor-pointer text-gray-500">
							<ChevronRight width={18} height={18} />
						</button>
						{!isCurrentMonth && (
							<button
								onClick={() => { setMonth(now.getMonth()); setYear(now.getFullYear()); }}
								className="text-xs text-emerald-600 hover:text-emerald-700 font-medium cursor-pointer"
							>
								Mês atual
							</button>
						)}
						<button
							onClick={() => generatePetPDF(pet, appointments, vaccines)}
							className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition cursor-pointer ml-2"
						>
							<FileDown width={16} height={16} />
							Exportar PDF
						</button>
					</div>
				</div>

				{/* Pet info */}
				<div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
					<h1 className="text-2xl font-semibold text-gray-800 mb-1">{pet.name}</h1>
					<p className="text-sm text-gray-500 mb-4">{pet.species}{pet.breed ? ` · ${pet.breed}` : ''}</p>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
						{pet.sex && (
							<div>
								<p className="text-gray-400 text-xs">Sexo</p>
								<p className="font-medium text-gray-700">{sexLabel[pet.sex]}</p>
							</div>
						)}
						{pet.weight && (
							<div>
								<p className="text-gray-400 text-xs">Peso</p>
								<p className="font-medium text-gray-700">{pet.weight} kg</p>
							</div>
						)}
						{pet.birth_date && (
							<div>
								<p className="text-gray-400 text-xs">Nascimento</p>
								<p className="font-medium text-gray-700">{formatDate(pet.birth_date)}</p>
							</div>
						)}
						{pet.owner && (
							<div>
								<p className="text-gray-400 text-xs">Dono</p>
								<p className="font-medium text-gray-700">{pet.owner.name}</p>
								{pet.owner.phone && <p className="text-gray-500 text-xs">{pet.owner.phone}</p>}
							</div>
						)}
					</div>
				</div>

				{loadingHistory ? (
					<div className="text-center text-gray-400 py-12">Carregando histórico...</div>
				) : (
					<>
						{/* Consultas */}
						<div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto mb-6">
							<div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100">
								<CalendarDays className="text-emerald-600" width={18} height={18} />
								<h2 className="text-sm font-semibold text-gray-700">
									Consultas — {MONTHS[month]} {year}
								</h2>
								<span className="ml-auto text-xs text-gray-400">
									{appointments.length} consulta{appointments.length !== 1 ? 's' : ''}
								</span>
							</div>
							{appointments.length === 0 ? (
								<p className="text-gray-400 text-sm px-6 py-8 text-center">Nenhuma consulta em {MONTHS[month]}.</p>
							) : (
								<table className="min-w-full text-sm">
									<thead className="bg-gray-50 text-gray-600">
										<tr>
											<th className="text-left px-6 py-3 font-medium">Data</th>
											<th className="text-left px-6 py-3 font-medium">Status</th>
											<th className="text-left px-6 py-3 font-medium">Diagnóstico</th>
											<th className="text-left px-6 py-3 font-medium">Observações</th>
										</tr>
									</thead>
									<tbody>
										{appointments.map((a) => (
											<tr key={a.id} className="border-t hover:bg-gray-50 transition">
												<td className="px-6 py-3 text-gray-700 whitespace-nowrap">{formatDateTime(a.date)}</td>
												<td className="px-6 py-3">
													<span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[a.status]}`}>
														{statusLabel[a.status]}
													</span>
												</td>
												<td className="px-6 py-3 text-gray-600 max-w-xs">{a.diagnosis || '—'}</td>
												<td className="px-6 py-3 text-gray-600 max-w-xs">{a.notes || '—'}</td>
											</tr>
										))}
									</tbody>
								</table>
							)}
						</div>

						{/* Vacinas */}
						<div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
							<div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100">
								<Shield className="text-emerald-600" width={18} height={18} />
								<h2 className="text-sm font-semibold text-gray-700">
									Vacinas aplicadas — {MONTHS[month]} {year}
								</h2>
								<span className="ml-auto text-xs text-gray-400">
									{vaccines.length} vacina{vaccines.length !== 1 ? 's' : ''}
								</span>
							</div>
							{vaccines.length === 0 ? (
								<p className="text-gray-400 text-sm px-6 py-8 text-center">Nenhuma vacina aplicada em {MONTHS[month]}.</p>
							) : (
								<table className="min-w-full text-sm">
									<thead className="bg-gray-50 text-gray-600">
										<tr>
											<th className="text-left px-6 py-3 font-medium">Vacina</th>
											<th className="text-left px-6 py-3 font-medium">Aplicação</th>
											<th className="text-left px-6 py-3 font-medium">Próxima dose</th>
											<th className="text-left px-6 py-3 font-medium">Observações</th>
										</tr>
									</thead>
									<tbody>
										{vaccines.map((v) => (
											<tr key={v.id} className="border-t hover:bg-gray-50 transition">
												<td className="px-6 py-3 font-medium text-gray-800">{v.name}</td>
												<td className="px-6 py-3 text-gray-600">{formatDate(v.application_date)}</td>
												<td className="px-6 py-3 text-gray-600">{formatDate(v.next_dose_date)}</td>
												<td className="px-6 py-3 text-gray-600 max-w-xs">{v.notes || '—'}</td>
											</tr>
										))}
									</tbody>
								</table>
							)}
						</div>
					</>
				)}
			</div>
		</Layout>
	);
}
