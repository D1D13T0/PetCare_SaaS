import { Menu } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
	onToggleSidebar: () => void;
}

export default function Navbar({ onToggleSidebar }: NavbarProps) {
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	function handleLogout() {
		logout();
		navigate('/login', { replace: true });
	}

	const displayName =
		user?.email?.split('@')[0].charAt(0).toUpperCase() +
		user?.email?.split('@')[0].slice(1);

	return (
		<div className="w-full bg-white border-b border-gray-200 px-4 md:px-8 py-4 flex items-center justify-between">
			<button
				onClick={onToggleSidebar}
				className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition cursor-pointer"
				aria-label="Abrir menu"
			>
				<Menu width={20} height={20} />
			</button>

			<div className="flex items-center gap-4 ml-auto">
				<Link
					to="/profile"
					className="text-sm text-gray-600 hover:text-emerald-600 transition"
				>
					Olá, <span className="font-medium">{displayName}</span>
				</Link>

				<button
					onClick={handleLogout}
					className="text-sm bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer px-4 py-1.5 rounded-lg transition"
				>
					Sair
				</button>
			</div>
		</div>
	);
}
