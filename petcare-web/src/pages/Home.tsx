import { AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import DashboardCard from '../components/layout/DashboardCard';
import Layout from '../components/layout/Layout';
import api from '../services/api';

interface DashboardData {
	totalPets: number;
	appointmentsThisMonth: number;
	upcomingVaccines: number;
}

interface UpcomingVaccine {
	id: string;
	name: string;
	next_dose_date: string;
	Pet: { id: string; name: string };
}

const MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

function formatDate(date: string) {
	return new Date(date).toLocaleDateString('pt-BR');
}

function daysUntil(date: string) {
	const diff = new Date(date).getTime() - new Date().setHours(0, 0, 0, 0);
	return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function Home() {
	const now = new Date();
	const [year, setYear] = useState(now.getFullYear());
	const [month, setMonth] = useState(now.getMonth());

	const [data, setData] = useState<DashboardData | null>(null);
	const [upcomingVaccines, setUpcomingVaccines] = useState<UpcomingVaccine[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		fetchAll();
	}, [month, year]);

	async function fetchAll() {
		setLoading(true);
		setError('');
		try {
			const start = new Date(year, month, 1).toISOString();
			const end = new Date(year, month + 1, 0, 23, 59, 59).toISOString();

			const [dashRes, vaccinesRes] = await Promise.all([
				api.get('/dashboard', { params: { start, end } }),
				api.get('/vaccines/upcoming'),
			]);
			setData(dashRes.data);
			setUpcomingVaccines(vaccinesRes.data);
		} catch {
			setError('Erro ao carregar dashboard');
		} finally {
			setLoading(false);
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

	function goToCurrentMonth() {
		setMonth(now.getMonth());
		setYear(now.getFullYear());
	}

	const isCurrentMonth = month === now.getMonth() && year === now.getFullYear();

	return (
		<Layout>
			<div className="p-4 md:p-8">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
					<h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>

					<div className="flex items-center gap-2">
						<button
							onClick={prevMonth}
							className="p-1.5 rounded-lg hover:bg-gray-100 transition cursor-pointer text-gray-500"
						>
							<ChevronLeft width={18} height={18} />
						</button>
						<span className="text-sm font-medium text-gray-700 w-36 text-center">
							{MONTHS[month]} {year}
						</span>
						<button
							onClick={nextMonth}
							className="p-1.5 rounded-lg hover:bg-gray-100 transition cursor-pointer text-gray-500"
						>
							<ChevronRight width={18} height={18} />
						</button>
						{!isCurrentMonth && (
							<button
								onClick={goToCurrentMonth}
								className="text-xs text-emerald-600 hover:text-emerald-700 font-medium ml-1 cursor-pointer"
							>
								Mês atual
							</button>
						)}
					</div>
				</div>

				{loading && <p className="text-gray-500">Carregando dados...</p>}
				{error && <p className="text-red-500">{error}</p>}

				{data && (
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
						<DashboardCard title="Total de Pets" value={data.totalPets} />
						<DashboardCard title={`Agendamentos em ${MONTHS[month]}`} value={data.appointmentsThisMonth} />
						<DashboardCard title={`Vacinas em ${MONTHS[month]}`} value={data.upcomingVaccines} />
					</div>
				)}

				{!loading && upcomingVaccines.length > 0 && (
					<div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
						<div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100">
							<AlertCircle className="text-amber-500" width={18} height={18} />
							<h2 className="text-sm font-semibold text-gray-700">
								Vacinas próximas do vencimento (7 dias)
							</h2>
						</div>
						<div className="overflow-x-auto">
							<table className="min-w-full text-sm">
								<thead className="bg-gray-50 text-gray-600">
									<tr>
										<th className="text-left px-6 py-3 font-medium">Pet</th>
										<th className="text-left px-6 py-3 font-medium">Vacina</th>
										<th className="text-left px-6 py-3 font-medium">Data</th>
										<th className="text-left px-6 py-3 font-medium">Prazo</th>
									</tr>
								</thead>
								<tbody>
									{upcomingVaccines.map((vaccine) => {
										const days = daysUntil(vaccine.next_dose_date);
										return (
											<tr key={vaccine.id} className="border-t hover:bg-amber-50 transition">
												<td className="px-6 py-3 font-medium text-gray-800 whitespace-nowrap">{vaccine.Pet?.name ?? '—'}</td>
												<td className="px-6 py-3 text-gray-600 whitespace-nowrap">{vaccine.name}</td>
												<td className="px-6 py-3 text-gray-600 whitespace-nowrap">{formatDate(vaccine.next_dose_date)}</td>
												<td className="px-6 py-3">
													<span className={`text-xs font-medium px-2 py-1 rounded-full ${days <= 1 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
														{days <= 0 ? 'Hoje' : days === 1 ? 'Amanhã' : `${days} dias`}
													</span>
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
					</div>
				)}
			</div>
		</Layout>
	);
}
