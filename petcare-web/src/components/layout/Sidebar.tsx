import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen p-6">

      <h2 className="text-xl font-bold text-emerald-600 mb-10">
        🐾 PetCare
      </h2>

      <nav className="flex flex-col gap-4 text-sm">

        <NavLink
          to="/home"
          className={({ isActive }) =>
            `px-3 py-2 rounded-lg transition ${
              isActive
                ? "bg-emerald-100 text-emerald-700 font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/pets"
          className={({ isActive }) =>
            `px-3 py-2 rounded-lg transition ${
              isActive
                ? "bg-emerald-100 text-emerald-700 font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`
          }
        >
          Pets
        </NavLink>

        <NavLink
          to="/owners"
          className={({ isActive }) =>
            `px-3 py-2 rounded-lg transition ${
              isActive
                ? "bg-emerald-100 text-emerald-700 font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`
          }
        >
          Donos
        </NavLink>

        <NavLink
          to="/appointments"
          className={({ isActive }) =>
            `px-3 py-2 rounded-lg transition ${
              isActive
                ? "bg-emerald-100 text-emerald-700 font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`
          }
        >
          Agendamentos
        </NavLink>

      </nav>
    </div>
  );
}