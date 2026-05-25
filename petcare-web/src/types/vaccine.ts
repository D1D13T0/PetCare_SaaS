export interface Vaccine {
	id: string;
	clinic_id: string;
	pet_id: string;
	name: string;
	application_date: string;
	next_dose_date?: string;
	notes?: string;
}

export interface CreateVaccineDTO {
	pet_id: string;
	name: string;
	application_date: string;
	next_dose_date?: string;
	notes?: string;
}
