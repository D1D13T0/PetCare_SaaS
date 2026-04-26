import { Navigate, Route, Routes } from 'react-router-dom';
import { Appointments } from './pages/Appointments';
import Home from './pages/Home';
import Login from './pages/Login';
import { Owners } from './pages/Owners';
import Pets from './pages/Pets';
import Register from './pages/Register';
import PrivateRoute from './routes/PrivateRoute';

function App() {
	return (
		<Routes>
			{/* Redireciona / para /login */}
			<Route path="/" element={<Navigate to="/login" />} />

			{/* Públicas */}
			<Route path="/login" element={<Login />} />
			<Route path="/register" element={<Register />} />

			{/* Protegidas */}
			<Route
				path="/home"
				element={
					<PrivateRoute>
						<Home />
					</PrivateRoute>
				}
			/>

			<Route
				path="/pets"
				element={
					<PrivateRoute>
						<Pets />
					</PrivateRoute>
				}
			/>
		</Routes>
	);
}

export default App;
