export type AppointmentStatus = 'SCHEDULED' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface Appointment {
	id: string;
	clinic_id: string;
	pet_id: string;
	veterinarian_id: string;
	date: string;
	status: AppointmentStatus;
	diagnosis?: string;
	notes?: string;
	valor?: number;
}

export interface CreateAppointmentDTO {
	pet_id: string;
	veterinarian_id: string;
	date: string;
	notes?: string;
	valor?: number;
}

export interface CompleteAppointmentDTO {
	diagnosis: string;
	notes?: string;
	valor?: number;
}
