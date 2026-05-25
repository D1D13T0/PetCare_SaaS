import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import './index.css';
import App from './App';
import { AppointmentProvider } from './context/AppointmentContext';
import { OwnerProvider } from './context/OwnerContext';
import { PetProvider } from './context/PetContext';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<BrowserRouter>
			<AuthProvider>
				<OwnerProvider>
					<PetProvider>
						<AppointmentProvider>
							<App />
							<Toaster position="top-right" />
						</AppointmentProvider>
					</PetProvider>
				</OwnerProvider>
			</AuthProvider>
		</BrowserRouter>
	</StrictMode>,
);
