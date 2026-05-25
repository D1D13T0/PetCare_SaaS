import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children }: { children: ReactNode }) {
	const token = localStorage.getItem('token');
	const user = JSON.parse(localStorage.getItem('user') ?? 'null');

	if (!token) return <Navigate to="/login" replace />;

	if (!user?.clinic_id) {
		if (user?.role === 'ADMIN') return <Navigate to="/onboarding" replace />;
		return <Navigate to="/pending" replace />;
	}

	return <>{children}</>;
}
