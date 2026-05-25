import { createContext, type ReactNode, useContext, useState } from 'react';
import api from '../services/api';

interface Pet {
	id: string;
	name: string;
	species: string;
	breed?: string;
	sex?: 'M' | 'F';
	weight?: number;
	birth_date?: string;
	owner_id?: string;
}

interface PetContextType {
	pets: Pet[];
	loading: boolean;
	fetchPets: () => Promise<void>;
	createPet: (data: Partial<Pet>) => Promise<void>;
	updatePet: (id: string, data: Partial<Pet>) => Promise<void>;
	deletePet: (id: string) => Promise<void>;
}

const PetContext = createContext<PetContextType | null>(null);

export function PetProvider({ children }: { children: ReactNode }) {
	const [pets, setPets] = useState<Pet[]>([]);
	const [loading, setLoading] = useState(false);

	async function fetchPets() {
		setLoading(true);
		try {
			const response = await api.get('/pets');
			setPets(response.data);
		} finally {
			setLoading(false);
		}
	}

	async function createPet(data: Partial<Pet>) {
		await api.post('/pets', data);
		await fetchPets();
	}

	async function updatePet(id: string, data: Partial<Pet>) {
		const response = await api.put(`/pets/${id}`, data);
		setPets((prev) => prev.map((p) => (p.id === id ? response.data : p)));
	}

	async function deletePet(id: string) {
		await api.delete(`/pets/${id}`);
		setPets((prev) => prev.filter((p) => p.id !== id));
	}

	return (
		<PetContext.Provider value={{ pets, loading, fetchPets, createPet, updatePet, deletePet }}>
			{children}
		</PetContext.Provider>
	);
}

export function usePets() {
	const context = useContext(PetContext);
	if (!context) {
		throw new Error('usePets must be used inside PetProvider');
	}
	return context;
}
