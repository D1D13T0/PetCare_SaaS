import { createContext, type ReactNode, useContext, useState } from 'react';
import api from '../services/api';
import type { Appointment, CompleteAppointmentDTO, CreateAppointmentDTO } from '../types/appointment';

interface FetchParams {
	pet_id?: string;
	start?: string;
	end?: string;
}

interface AppointmentContextType {
	appointments: Appointment[];
	loading: boolean;
	fetchAppointments: (params?: FetchParams) => Promise<void>;
	createAppointment: (data: CreateAppointmentDTO) => Promise<void>;
	completeAppointment: (id: string, data: CompleteAppointmentDTO) => Promise<void>;
}

const AppointmentContext = createContext<AppointmentContextType | null>(null);

export function AppointmentProvider({ children }: { children: ReactNode }) {
	const [appointments, setAppointments] = useState<Appointment[]>([]);
	const [loading, setLoading] = useState(false);

	async function fetchAppointments(params?: FetchParams) {
		setLoading(true);
		try {
			let response;
			if (params?.pet_id) {
				response = await api.get(`/appointments/pet/${params.pet_id}`, {
					params: { start: params.start, end: params.end },
				});
			} else {
				response = await api.get('/appointments', {
					params: { start: params?.start, end: params?.end },
				});
			}
			setAppointments(response.data);
		} finally {
			setLoading(false);
		}
	}

	async function createAppointment(data: CreateAppointmentDTO) {
		await api.post('/appointments', data);
		await fetchAppointments();
	}

	async function completeAppointment(id: string, data: CompleteAppointmentDTO) {
		const response = await api.patch(`/appointments/${id}/complete`, data);
		setAppointments((prev) =>
			prev.map((a) => (a.id === id ? response.data : a)),
		);
	}

	return (
		<AppointmentContext.Provider
			value={{ appointments, loading, fetchAppointments, createAppointment, completeAppointment }}
		>
			{children}
		</AppointmentContext.Provider>
	);
}

export function useAppointments() {
	const context = useContext(AppointmentContext);
	if (!context) {
		throw new Error('useAppointments must be used inside AppointmentProvider');
	}
	return context;
}
