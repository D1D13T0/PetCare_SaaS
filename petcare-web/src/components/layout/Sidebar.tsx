import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
	isOpen: boolean;
	onClose: () => void;
}

const navClass = ({ isActive }: { isActive: boolean }) =>
	`px-3 py-2 rounded-lg transition ${
		isActive
			? 'bg-emerald-100 text-emerald-700 font-medium'
			: 'text-gray-600 hover:bg-gray-100'
	}`;

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
	const { user } = useAuth();
	const isAdmin = user?.role === 'ADMIN';

	return (
		<aside
			className={`
				fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 p-6
				transform transition-transform duration-300 ease-in-out
				${isOpen ? 'translate-x-0' : '-translate-x-full'}
				lg:relative lg:translate-x-0 lg:flex lg:flex-col
			`}
		>
			<h2 className="text-xl font-bold text-emerald-600 mb-10">
				🐾 PetCare
			</h2>

			<nav className="flex flex-col gap-4 text-sm">
				<NavLink to="/home" className={navClass} onClick={onClose}>Dashboard</NavLink>
				<NavLink to="/pets" className={navClass} onClick={onClose}>Pets</NavLink>
				<NavLink to="/owners" className={navClass} onClick={onClose}>Donos</NavLink>
				<NavLink to="/appointments" className={navClass} onClick={onClose}>Agendamentos</NavLink>
				<NavLink to="/vaccines" className={navClass} onClick={onClose}>Vacinas</NavLink>
				<NavLink to="/financeiro" className={navClass} onClick={onClose}>Financeiro</NavLink>
				{isAdmin && (
					<NavLink to="/clinic" className={navClass} onClick={onClose}>Clínica</NavLink>
				)}
			</nav>
		</aside>
	);
}
