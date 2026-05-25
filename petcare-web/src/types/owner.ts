export interface Owner {
	id: string;
	name: string;
	email: string;
	phone: string;
	document: string;
	clinic_id?: string;
	created_at?: string;
}

export interface CreateOwnerDTO {
	name: string;
	email: string;
	phone: string;
	document: string;
}
