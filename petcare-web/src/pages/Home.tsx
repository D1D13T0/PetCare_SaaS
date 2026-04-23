import { useEffect, useState } from "react";
import DashboardCard from "../components/layout/DashboardCard";
import api from "../services/api";
import Layout from "../components/layout/Layout";

interface DashboardData {
  totalPets: number;
  appointmentsThisMonth: number;
  upcomingVaccines: number;
}

export default function Home() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const response = await api.get("/dashboard");
        setData(response.data);
      } catch (err) {
        setError("Erro ao carregar dashboard");
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  return (
    <Layout>

      <div className="p-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Dashboard
        </h1>

        {loading && (
          <p className="text-gray-500">Carregando dados...</p>
        )}

        {error && (
          <p className="text-red-500">{error}</p>
        )}

        {data && (
          <div className="grid md:grid-cols-3 gap-6">
            <DashboardCard
              title="Total de Pets"
              value={data.totalPets}
            />

            <DashboardCard
              title="Agendamentos este mês"
              value={data.appointmentsThisMonth}
            />

            <DashboardCard
              title="Vacinas pendentes"
              value={data.upcomingVaccines}
            />
          </div>
        )}
      </div>
    </Layout>
  );
}