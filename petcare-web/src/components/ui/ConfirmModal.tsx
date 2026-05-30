import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
	isOpen: boolean;
	title: string;
	message: string;
	confirmLabel?: string;
	variant?: 'danger' | 'warning';
	loading?: boolean;
	onConfirm: () => void;
	onClose: () => void;
}

export default function ConfirmModal({
	isOpen,
	title,
	message,
	confirmLabel = 'Confirmar',
	variant = 'danger',
	loading = false,
	onConfirm,
	onClose,
}: ConfirmModalProps) {
	if (!isOpen) return null;

	const confirmClass =
		variant === 'danger'
			? 'bg-red-500 hover:bg-red-600 text-white'
			: 'bg-amber-500 hover:bg-amber-600 text-white';

	const iconClass = variant === 'danger' ? 'text-red-500' : 'text-amber-500';
	const iconBg = variant === 'danger' ? 'bg-red-50' : 'bg-amber-50';

	return (
		<div className="fixed inset-0 flex items-center justify-center z-50">
			<div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
			<div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 z-10 animate-[fadeIn_.2s_ease-out]">
				<div className={`w-12 h-12 rounded-full ${iconBg} flex items-center justify-center mb-4`}>
					<AlertTriangle className={iconClass} width={22} height={22} />
				</div>
				<h2 className="text-lg font-semibold text-gray-800 mb-1">{title}</h2>
				<p className="text-sm text-gray-500 mb-6">{message}</p>
				<div className="flex gap-3 justify-end">
					<button
						type="button"
						onClick={onClose}
						disabled={loading}
						className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 text-sm transition cursor-pointer disabled:opacity-50"
					>
						Cancelar
					</button>
					<button
						type="button"
						onClick={onConfirm}
						disabled={loading}
						className={`px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer disabled:opacity-50 ${confirmClass}`}
					>
						{loading ? 'Aguarde...' : confirmLabel}
					</button>
				</div>
			</div>
		</div>
	);
}
