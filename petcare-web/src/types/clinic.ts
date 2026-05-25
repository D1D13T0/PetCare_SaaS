export interface Clinic {
	id: string;
	name: string;
	cnpj?: string;
}

export interface ClinicUser {
	id: string;
	email: string;
	role: 'ADMIN' | 'OWNER';
}
