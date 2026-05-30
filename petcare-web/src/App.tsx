import { Navigate, Route, Routes } from 'react-router-dom';
import AdminLogin from './pages/AdminLogin';
import { Appointments } from './pages/Appointments';
import { ClinicPage } from './pages/Clinic';
import Financeiro from './pages/Financeiro';
import Home from './pages/Home';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import { Owners } from './pages/Owners';
import Pending from './pages/Pending';
import PetHistory from './pages/PetHistory';
import Pets from './pages/Pets';
import Profile from './pages/Profile';
import Register from './pages/Register';
import { Vaccines } from './pages/Vaccines';
import AdminRoute from './routes/AdminRoute';
import PrivateRoute from './routes/PrivateRoute';

function App() {
	return (
		<Routes>
			<Route path="/" element={<Navigate to="/login" />} />

			{/* Públicas */}
			<Route path="/login" element={<Login />} />
			<Route path="/admin-login" element={<AdminLogin />} />
			<Route path="/register" element={<Register />} />
			<Route path="/onboarding" element={<Onboarding />} />
			<Route path="/pending" element={<Pending />} />

			{/* Protegidas */}
			<Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
			<Route path="/pets" element={<PrivateRoute><Pets /></PrivateRoute>} />
			<Route path="/pets/:id" element={<PrivateRoute><PetHistory /></PrivateRoute>} />
			<Route path="/owners" element={<PrivateRoute><Owners /></PrivateRoute>} />
			<Route path="/appointments" element={<PrivateRoute><Appointments /></PrivateRoute>} />
			<Route path="/vaccines" element={<PrivateRoute><Vaccines /></PrivateRoute>} />
			<Route path="/financeiro" element={<PrivateRoute><Financeiro /></PrivateRoute>} />
			<Route path="/clinic" element={<PrivateRoute><AdminRoute><ClinicPage /></AdminRoute></PrivateRoute>} />
			<Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
		</Routes>
	);
}

export default App;
