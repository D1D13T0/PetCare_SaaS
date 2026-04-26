import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from 'react';
import api from '../services/api';

interface Pet {
	id: string;
	name: string;
	species: string;
	breed?: string;
}

interface PetContextType {
	pets: Pet[];
	loading: boolean;
	fetchPets: () => Promise<void>;
	createPet: (data: Partial<Pet>) => Promise<void>;
}

const PetContext = createContext<PetContextType | null>(null);

export function PetProvider({ children }: { children: ReactNode }) {
	const [pets, setPets] = useState<Pet[]>([]);
	const [loading, setLoading] = useState(true);

	async function fetchPets() {
		try {
			const response = await api.get('/pets');
			setPets(response.data);
		} finally {
			setLoading(false);
		}
	}

	async function createPet(data: Partial<Pet>) {
		await api.post('/pets', data);
		await fetchPets(); // atualiza automaticamente
	}

	useEffect(() => {
		fetchPets();
	}, []);

	return (
		<PetContext.Provider value={{ pets, loading, fetchPets, createPet }}>
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
