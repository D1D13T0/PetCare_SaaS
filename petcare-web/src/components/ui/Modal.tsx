import { ReactNode } from 'react';

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	children: ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 flex items-center justify-center z-50">
			{/* Backdrop */}
			<div
				className="absolute inset-0 bg-black/40 backdrop-blur-sm"
				onClick={onClose}
			/>

			{/* Modal content */}
			<div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 z-10 animate-[fadeIn_.2s_ease-out]">
				{children}
			</div>
		</div>
	);
}
