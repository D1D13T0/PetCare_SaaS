import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { usePets } from '../context/PetContext';
import api from '../services/api';

interface Pet {
	id: string;
	name: string;
	species: string;
	breed?: string;
	birth_date?: string;
}

export default function Pets() {
	const { pets, loading, createPet } = usePets();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [name, setName] = useState('');
	const [species, setSpecies] = useState('');
	const [breed, setBreed] = useState('');
	const [loadingCreate, setLoadingCreate] = useState(false);
	const [ownerSearch, setOwnerSearch] = useState('');
	const [owners, setOwners] = useState<any[]>([]);
	const [ownerId, setOwnerId] = useState('');
	const [searchLoading, setSearchLoading] = useState(false);

	async function fetchOwners() {
		try {
			const response = await api.get('/owners');
			setOwners(response.data);
		} catch {
			toast.error('Erro ao carregar donos');
		}
	}

	useEffect(() => {
		fetchOwners();
	}, []);

	useEffect(() => {
		const delayDebounce = setTimeout(() => {
			if (ownerSearch.length < 2) {
				setOwners([]);
				return;
			}

			searchOwners(ownerSearch);
		}, 300);

		return () => clearTimeout(delayDebounce);
	}, [ownerSearch]);

	async function searchOwners(query: string) {
		try {
			setSearchLoading(true);

			const response = await api.get('/owners', {
				params: { search: query },
			});

			setOwners(response.data);
		} catch {
			toast.error('Erro ao buscar donos');
		} finally {
			setSearchLoading(false);
		}
	}

	async function handleCreatePet(e: React.FormEvent) {
		e.preventDefault();
		setLoadingCreate(true);

		try {
			await createPet({
				name,
				species,
				breed,
				owner_id: ownerId,
			});

			toast.success('Pet criado com sucesso!');
			setIsModalOpen(false);
			setName('');
			setSpecies('');
			setBreed('');
			setOwnerId('');
		} catch {
			toast.error('Erro ao criar pet');
		} finally {
			setLoadingCreate(false);
		}
	}

	return (
		<Layout>
			<div className="flex items-center justify-between mb-8">
				<div>
					<h1 className="text-3xl font-semibold text-gray-800">Pets</h1>
					<p className="text-gray-500 text-sm">
						Gerencie os pets da sua clínica
					</p>
				</div>

				<Button
					className="w-auto px-6 flex items-center gap-2"
					onClick={() => setIsModalOpen(true)}
				>
					Novo Pet <Plus width={18} height={18} strokeWidth={3} />
				</Button>
			</div>

			<div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
				{loading ? (
					<div className="p-8 text-center text-gray-500">
						Carregando pets...
					</div>
				) : pets.length === 0 ? (
					<div className="p-12 text-center">
						<p className="text-gray-500">Nenhum pet cadastrado ainda.</p>
					</div>
				) : (
					<table className="w-full text-sm">
						<thead className="bg-gray-50 text-gray-600">
							<tr>
								<th className="text-left px-8 py-4 font-medium">Nome</th>
								<th className="text-left px-8 py-4 font-medium">Espécie</th>
								<th className="text-left px-8 py-4 font-medium">Raça</th>
							</tr>
						</thead>

						<tbody>
							{pets.map((pet) => (
								<tr
									key={pet.id}
									className="border-t hover:bg-emerald-50 transition"
								>
									<td className="px-8 py-4 font-semibold text-gray-800">
										{pet.name}
									</td>
									<td className="px-8 py-4 text-gray-600">{pet.species}</td>
									<td className="px-8 py-4 text-gray-600">
										{pet.breed || '-'}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				)}
			</div>
			<Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
				<h2 className="text-xl font-semibold mb-4 text-gray-800">Novo Pet</h2>

				<form onSubmit={handleCreatePet} className="flex flex-col gap-4">
					<div>
						<label className="text-sm text-gray-600">Nome</label>
						<input
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
							required
						/>
					</div>

					<div>
						<label className="text-sm text-gray-600">Espécie</label>
						<input
							type="text"
							value={species}
							onChange={(e) => setSpecies(e.target.value)}
							className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
							required
						/>
					</div>

					<div className="relative">
						<label className="text-sm text-gray-600">Dono</label>

						<input
							type="text"
							placeholder="Digite para buscar..."
							value={ownerSearch}
							onChange={(e) => {
								setOwnerSearch(e.target.value);
								setOwnerId('');
							}}
							className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
							required
						/>

						{searchLoading && (
							<div className="absolute right-3 top-9 text-xs text-gray-400">
								Buscando...
							</div>
						)}

						{owners.length > 0 && (
							<div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow max-h-48 overflow-y-auto">
								{owners.map((owner) => (
									<div
										key={owner.id}
										onClick={() => {
											setOwnerId(owner.id);
											setOwnerSearch(owner.name);
											setOwners([]);
										}}
										className="px-3 py-2 hover:bg-emerald-50 cursor-pointer text-sm transition"
									>
										{owner.name}
									</div>
								))}
							</div>
						)}
					</div>

					<div>
						<label className="text-sm text-gray-600">Raça</label>
						<input
							type="text"
							value={breed}
							onChange={(e) => setBreed(e.target.value)}
							className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
						/>
					</div>

					<div className="flex justify-end gap-3 mt-4">
						<button
							type="button"
							onClick={() => setIsModalOpen(false)}
							className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition cursor-pointer"
						>
							Cancelar
						</button>

						<Button type="submit">
							{loadingCreate ? 'Criando...' : 'Salvar'}
						</Button>
					</div>
				</form>
			</Modal>
		</Layout>
	);
}
