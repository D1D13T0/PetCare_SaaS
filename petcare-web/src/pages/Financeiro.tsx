import { ChevronLeft, ChevronRight, FileDown, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Layout from '../components/layout/Layout';
import { generateFinanceiroPDF } from '../lib/pdf';
import api from '../services/api';

interface ReportAppointment {
	id: string;
	date: string;
	valor?: number;
	Pet: { id: string; name: string };
}

interface Report {
	appointments: ReportAppointment[];
	total: number;
	count: number;
}

const MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

function formatDate(date: string) {
	return new Date(date).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function formatCurrency(value?: number) {
	if (!value) return '—';
	return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function Financeiro() {
	const now = new Date();
	const [year, setYear] = useState(now.getFullYear());
	const [month, setMonth] = useState(now.getMonth());
	const [report, setReport] = useState<Report | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchReport();
	}, [month, year]);

	async function fetchReport() {
		setLoading(true);
		try {
			const start = new Date(year, month, 1).toISOString();
			const end = new Date(year, month + 1, 0, 23, 59, 59).toISOString();
			const response = await api.get('/appointments/report', { params: { start, end } });
			setReport(response.data);
		} catch {
			toast.error('Erro ao carregar relatório');
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

	const isCurrentMonth = month === now.getMonth() && year === now.getFullYear();
	const countWithValor = report?.appointments.filter((a) => a.valor && a.valor > 0).length ?? 0;
	const ticketMedio = countWithValor > 0 ? (report?.total ?? 0) / countWithValor : 0;

	return (
		<Layout>
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
				<div>
					<h1 className="text-3xl font-semibold text-gray-800">Financeiro</h1>
					<p className="text-gray-500 text-sm">Relatório de faturamento por período</p>
				</div>

				<div className="flex items-center gap-2 flex-wrap">
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
							className="text-xs text-emerald-600 hover:text-emerald-700 font-medium ml-1 cursor-pointer"
						>
							Mês atual
						</button>
					)}

				{report && report.count > 0 && (
					<button
						onClick={() => generateFinanceiroPDF(month, year, report.appointments, report.total, report.count)}
						className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition cursor-pointer ml-2"
					>
						<FileDown width={16} height={16} />
						Exportar PDF
					</button>
				)}
				</div>
			</div>

			{/* Cards de resumo */}
			{report && (
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
					<div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
						<p className="text-sm text-gray-500 mb-1">Faturamento total</p>
						<p className="text-2xl font-bold text-emerald-600">{formatCurrency(report.total)}</p>
					</div>
					<div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
						<p className="text-sm text-gray-500 mb-1">Consultas concluídas</p>
						<p className="text-2xl font-bold text-gray-800">{report.count}</p>
					</div>
					<div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
						<p className="text-sm text-gray-500 mb-1">Ticket médio</p>
						<p className="text-2xl font-bold text-gray-800">{formatCurrency(ticketMedio)}</p>
					</div>
				</div>
			)}

			{/* Tabela */}
			<div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
				{loading ? (
					<div className="p-8 text-center text-gray-500">Carregando...</div>
				) : !report || report.count === 0 ? (
					<div className="p-12 text-center flex flex-col items-center gap-3">
						<TrendingUp className="text-gray-300" width={48} height={48} />
						<p className="text-gray-500">Nenhuma consulta concluída em {MONTHS[month]}.</p>
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="min-w-full text-sm">
							<thead className="bg-gray-50 text-gray-600">
								<tr>
									<th className="text-left px-8 py-4 font-medium">Data</th>
									<th className="text-left px-8 py-4 font-medium">Pet</th>
									<th className="text-right px-8 py-4 font-medium">Valor</th>
								</tr>
							</thead>
							<tbody>
								{report.appointments.map((a) => (
									<tr key={a.id} className="border-t hover:bg-emerald-50 transition">
										<td className="px-8 py-4 text-gray-700 whitespace-nowrap">{formatDate(a.date)}</td>
										<td className="px-8 py-4 font-medium text-gray-800 whitespace-nowrap">{a.Pet?.name ?? '—'}</td>
										<td className="px-8 py-4 text-right font-medium text-gray-800 whitespace-nowrap">{formatCurrency(a.valor)}</td>
									</tr>
								))}
							</tbody>
							<tfoot className="border-t-2 border-gray-200 bg-gray-50">
								<tr>
									<td colSpan={2} className="px-8 py-4 text-sm font-semibold text-gray-700">Total</td>
									<td className="px-8 py-4 text-right text-sm font-bold text-emerald-600">{formatCurrency(report.total)}</td>
								</tr>
							</tfoot>
						</table>
					</div>
				)}
			</div>
		</Layout>
	);
}
