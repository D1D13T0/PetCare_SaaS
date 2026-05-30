import { createContext, type ReactNode, useContext, useState } from 'react';
import api from '../services/api';
import type { Appointment, CompleteAppointmentDTO, CreateAppointmentDTO } from '../types/appointment';

const LIMIT = 10;

interface FetchParams {
	pet_id?: string;
	start?: string;
	end?: string;
}

interface AppointmentContextType {
	appointments: Appointment[];
	loading: boolean;
	hasMore: boolean;
	fetchAppointments: (params?: FetchParams) => Promise<void>;
	loadMore: () => Promise<void>;
	createAppointment: (data: CreateAppointmentDTO) => Promise<void>;
	completeAppointment: (id: string, data: CompleteAppointmentDTO) => Promise<void>;
	cancelAppointment: (id: string) => Promise<void>;
}

const AppointmentContext = createContext<AppointmentContextType | null>(null);

export function AppointmentProvider({ children }: { children: ReactNode }) {
	const [appointments, setAppointments] = useState<Appointment[]>([]);
	const [loading, setLoading] = useState(false);
	const [hasMore, setHasMore] = useState(false);
	const [currentParams, setCurrentParams] = useState<FetchParams | undefined>();

	async function fetchAppointments(params?: FetchParams) {
		setLoading(true);
		setCurrentParams(params);
		try {
			let response;
			if (params?.pet_id) {
				response = await api.get(`/appointments/pet/${params.pet_id}`, {
					params: { start: params.start, end: params.end, limit: LIMIT, offset: 0 },
				});
			} else {
				response = await api.get('/appointments', {
					params: { start: params?.start, end: params?.end, limit: LIMIT, offset: 0 },
				});
			}
			setAppointments(response.data);
			setHasMore(response.data.length === LIMIT);
		} finally {
			setLoading(false);
		}
	}

	async function loadMore() {
		setLoading(true);
		try {
			let response;
			if (currentParams?.pet_id) {
				response = await api.get(`/appointments/pet/${currentParams.pet_id}`, {
					params: {
						start: currentParams.start, end: currentParams.end,
						limit: LIMIT, offset: appointments.length,
					},
				});
			} else {
				response = await api.get('/appointments', {
					params: {
						start: currentParams?.start, end: currentParams?.end,
						limit: LIMIT, offset: appointments.length,
					},
				});
			}
			setAppointments((prev) => [...prev, ...response.data]);
			setHasMore(response.data.length === LIMIT);
		} finally {
			setLoading(false);
		}
	}

	async function createAppointment(data: CreateAppointmentDTO) {
		await api.post('/appointments', data);
		await fetchAppointments(currentParams);
	}

	async function completeAppointment(id: string, data: CompleteAppointmentDTO) {
		const response = await api.patch(`/appointments/${id}/complete`, data);
		setAppointments((prev) => prev.map((a) => (a.id === id ? response.data : a)));
	}

	async function cancelAppointment(id: string) {
		const response = await api.patch(`/appointments/${id}/cancel`);
		setAppointments((prev) => prev.map((a) => (a.id === id ? response.data : a)));
	}

	return (
		<AppointmentContext.Provider
			value={{ appointments, loading, hasMore, fetchAppointments, loadMore, createAppointment, completeAppointment, cancelAppointment }}
		>
			{children}
		</AppointmentContext.Provider>
	);
}

export function useAppointments() {
	const context = useContext(AppointmentContext);
	if (!context) throw new Error('useAppointments must be used inside AppointmentProvider');
	return context;
}
