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
}

export interface CreateAppointmentDTO {
	pet_id: string;
	veterinarian_id: string;
	date: string;
	notes?: string;
}

export interface CompleteAppointmentDTO {
	diagnosis: string;
	notes?: string;
}
