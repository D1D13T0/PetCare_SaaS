import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';

export default function AdminRoute({ children }: { children: ReactNode }) {
	const user = JSON.parse(localStorage.getItem('user') ?? 'null');

	if (user?.role !== 'ADMIN') return <Navigate to="/home" replace />;

	return <>{children}</>;
}
