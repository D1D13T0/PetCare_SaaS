import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function formatDate(date?: string) {
	if (!date) return '—';
	return new Date(date).toLocaleDateString('pt-BR');
}

function formatDateTime(date: string) {
	return new Date(date).toLocaleString('pt-BR', {
		day: '2-digit', month: '2-digit', year: 'numeric',
		hour: '2-digit', minute: '2-digit',
	});
}

function formatCurrency(value?: number) {
	if (!value && value !== 0) return '—';
	return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

const sexLabel: Record<string, string> = { M: 'Macho', F: 'Fêmea' };
const statusLabel: Record<string, string> = {
	SCHEDULED: 'Agendado', CONFIRMED: 'Confirmado',
	CANCELLED: 'Cancelado', COMPLETED: 'Concluído',
};

interface Owner { name: string; phone?: string; email?: string; }
interface Pet {
	name: string; species: string; breed?: string;
	sex?: string; weight?: number; birth_date?: string; owner: Owner;
}
interface Appointment {
	date: string; status: string; diagnosis?: string; notes?: string;
}
interface Vaccine {
	name: string; application_date: string; next_dose_date?: string; notes?: string;
}

export function generatePetPDF(
	pet: Pet,
	appointments: Appointment[],
	vaccines: Vaccine[],
) {
	const doc = new jsPDF();
	const pageWidth = doc.internal.pageSize.getWidth();

	// Header
	doc.setFillColor(5, 150, 105); // emerald-600
	doc.rect(0, 0, pageWidth, 28, 'F');
	doc.setTextColor(255, 255, 255);
	doc.setFontSize(18);
	doc.setFont('helvetica', 'bold');
	doc.text('PetCare', 14, 12);
	doc.setFontSize(11);
	doc.setFont('helvetica', 'normal');
	doc.text('Ficha Médica do Pet', 14, 22);

	doc.setTextColor(0, 0, 0);

	// Pet info
	doc.setFontSize(14);
	doc.setFont('helvetica', 'bold');
	doc.text(pet.name, 14, 40);
	doc.setFontSize(10);
	doc.setFont('helvetica', 'normal');
	doc.setTextColor(100, 100, 100);
	doc.text(`${pet.species}${pet.breed ? ' · ' + pet.breed : ''}`, 14, 47);

	doc.setTextColor(0, 0, 0);

	const infoRows = [
		['Sexo', pet.sex ? sexLabel[pet.sex] : '—'],
		['Peso', pet.weight ? `${pet.weight} kg` : '—'],
		['Nascimento', formatDate(pet.birth_date)],
		['Dono', pet.owner?.name ?? '—'],
		['Telefone', pet.owner?.phone ?? '—'],
		['Email', pet.owner?.email ?? '—'],
	];

	autoTable(doc, {
		startY: 52,
		body: infoRows,
		theme: 'plain',
		columnStyles: {
			0: { fontStyle: 'bold', cellWidth: 35, textColor: [80, 80, 80] },
			1: { cellWidth: 100 },
		},
		styles: { fontSize: 9, cellPadding: 1.5 },
	});

	const afterInfo = (doc as any).lastAutoTable.finalY + 8;

	// Consultas
	doc.setFontSize(11);
	doc.setFont('helvetica', 'bold');
	doc.setTextColor(5, 150, 105);
	doc.text('Histórico de Consultas', 14, afterInfo);
	doc.setTextColor(0, 0, 0);

	autoTable(doc, {
		startY: afterInfo + 4,
		head: [['Data', 'Status', 'Diagnóstico', 'Observações']],
		body: appointments.length > 0
			? appointments.map(a => [
				formatDateTime(a.date),
				statusLabel[a.status] ?? a.status,
				a.diagnosis || '—',
				a.notes || '—',
			])
			: [['Nenhuma consulta registrada', '', '', '']],
		headStyles: { fillColor: [5, 150, 105], fontSize: 9 },
		styles: { fontSize: 8, cellPadding: 2 },
		columnStyles: {
			0: { cellWidth: 35 },
			1: { cellWidth: 25 },
		},
	});

	const afterAppts = (doc as any).lastAutoTable.finalY + 8;

	// Vacinas
	doc.setFontSize(11);
	doc.setFont('helvetica', 'bold');
	doc.setTextColor(5, 150, 105);
	doc.text('Histórico de Vacinas', 14, afterAppts);
	doc.setTextColor(0, 0, 0);

	autoTable(doc, {
		startY: afterAppts + 4,
		head: [['Vacina', 'Aplicação', 'Próxima dose', 'Observações']],
		body: vaccines.length > 0
			? vaccines.map(v => [
				v.name,
				formatDate(v.application_date),
				formatDate(v.next_dose_date),
				v.notes || '—',
			])
			: [['Nenhuma vacina registrada', '', '', '']],
		headStyles: { fillColor: [5, 150, 105], fontSize: 9 },
		styles: { fontSize: 8, cellPadding: 2 },
		columnStyles: { 0: { cellWidth: 50 } },
	});

	// Footer
	const pageCount = (doc as any).internal.getNumberOfPages();
	for (let i = 1; i <= pageCount; i++) {
		doc.setPage(i);
		doc.setFontSize(8);
		doc.setTextColor(150, 150, 150);
		doc.text(
			`Gerado em ${new Date().toLocaleString('pt-BR')} · Página ${i} de ${pageCount}`,
			14,
			doc.internal.pageSize.getHeight() - 8,
		);
	}

	doc.save(`ficha-medica-${pet.name.toLowerCase().replace(/\s+/g, '-')}.pdf`);
}

interface FinanceiroAppointment {
	date: string;
	valor?: number;
	Pet: { name: string };
}

export function generateFinanceiroPDF(
	month: number,
	year: number,
	appointments: FinanceiroAppointment[],
	total: number,
	count: number,
) {
	const MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
	const doc = new jsPDF();
	const pageWidth = doc.internal.pageSize.getWidth();

	// Header
	doc.setFillColor(5, 150, 105);
	doc.rect(0, 0, pageWidth, 28, 'F');
	doc.setTextColor(255, 255, 255);
	doc.setFontSize(18);
	doc.setFont('helvetica', 'bold');
	doc.text('PetCare', 14, 12);
	doc.setFontSize(11);
	doc.setFont('helvetica', 'normal');
	doc.text(`Relatório Financeiro · ${MONTHS[month]} ${year}`, 14, 22);

	doc.setTextColor(0, 0, 0);

	// Summary cards
	const ticketMedio = count > 0 ? total / count : 0;
	const summaryData = [
		['Faturamento Total', formatCurrency(total)],
		['Consultas Concluídas', String(count)],
		['Ticket Médio', formatCurrency(ticketMedio)],
	];

	autoTable(doc, {
		startY: 36,
		body: summaryData,
		theme: 'grid',
		columnStyles: {
			0: { fontStyle: 'bold', textColor: [80, 80, 80], cellWidth: 70 },
			1: { fontStyle: 'bold', textColor: [5, 150, 105], cellWidth: 60 },
		},
		styles: { fontSize: 10, cellPadding: 4 },
	});

	const afterSummary = (doc as any).lastAutoTable.finalY + 10;

	// Table
	doc.setFontSize(11);
	doc.setFont('helvetica', 'bold');
	doc.setTextColor(5, 150, 105);
	doc.text('Consultas do período', 14, afterSummary);
	doc.setTextColor(0, 0, 0);

	autoTable(doc, {
		startY: afterSummary + 4,
		head: [['Data', 'Pet', 'Valor']],
		body: appointments.length > 0
			? appointments.map(a => [
				formatDateTime(a.date),
				a.Pet?.name ?? '—',
				formatCurrency(a.valor),
			])
			: [['Nenhuma consulta concluída no período', '', '']],
		foot: appointments.length > 0
			? [['', 'Total', formatCurrency(total)]]
			: undefined,
		headStyles: { fillColor: [5, 150, 105], fontSize: 9 },
		footStyles: { fillColor: [240, 240, 240], fontStyle: 'bold', fontSize: 9 },
		styles: { fontSize: 9, cellPadding: 2.5 },
		columnStyles: {
			0: { cellWidth: 55 },
			2: { halign: 'right' },
		},
	});

	// Footer
	const pageCount = (doc as any).internal.getNumberOfPages();
	for (let i = 1; i <= pageCount; i++) {
		doc.setPage(i);
		doc.setFontSize(8);
		doc.setTextColor(150, 150, 150);
		doc.text(
			`Gerado em ${new Date().toLocaleString('pt-BR')} · Página ${i} de ${pageCount}`,
			14,
			doc.internal.pageSize.getHeight() - 8,
		);
	}

	doc.save(`relatorio-financeiro-${MONTHS[month].toLowerCase()}-${year}.pdf`);
}
