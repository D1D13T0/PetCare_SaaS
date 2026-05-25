import { createContext, type ReactNode, useContext, useState } from 'react';
import api from '../services/api';
import type { CreateOwnerDTO, Owner } from '../types/owner';

interface OwnerContextType {
	owners: Owner[];
	loading: boolean;
	fetchOwners: (search?: string) => Promise<void>;
	createOwner: (data: CreateOwnerDTO) => Promise<void>;
	updateOwner: (id: string, data: Partial<CreateOwnerDTO>) => Promise<void>;
	deleteOwner: (id: string) => Promise<void>;
}

const OwnerContext = createContext<OwnerContextType | null>(null);

export function OwnerProvider({ children }: { children: ReactNode }) {
	const [owners, setOwners] = useState<Owner[]>([]);
	const [loading, setLoading] = useState(false);

	async function fetchOwners(search?: string) {
		setLoading(true);
		try {
			const response = await api.get('/owners', {
				params: search ? { search } : undefined,
			});
			setOwners(response.data);
		} finally {
			setLoading(false);
		}
	}

	async function createOwner(data: CreateOwnerDTO) {
		await api.post('/owners', data);
		await fetchOwners();
	}

	async function updateOwner(id: string, data: Partial<CreateOwnerDTO>) {
		const response = await api.put(`/owners/${id}`, data);
		setOwners((prev) => prev.map((o) => (o.id === id ? response.data : o)));
	}

	async function deleteOwner(id: string) {
		await api.delete(`/owners/${id}`);
		setOwners((prev) => prev.filter((o) => o.id !== id));
	}

	return (
		<OwnerContext.Provider value={{ owners, loading, fetchOwners, createOwner, updateOwner, deleteOwner }}>
			{children}
		</OwnerContext.Provider>
	);
}

export function useOwners() {
	const context = useContext(OwnerContext);
	if (!context) {
		throw new Error('useOwners must be used inside OwnerProvider');
	}
	return context;
}
