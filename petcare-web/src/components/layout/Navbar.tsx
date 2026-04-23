import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="w-full bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold text-emerald-600">
        
      </h1>

      <div className="flex items-center gap-4">
       <span className="text-sm text-gray-600">
  Olá,{" "}
  <span className="font-medium">
    {user?.email?.split("@")[0].charAt(0).toUpperCase() +
 user?.email?.split("@")[0].slice(1)}
  </span>
</span>

        <button
          onClick={handleLogout}
          className="text-sm bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded-lg transition"
        >
          Sair
        </button>
      </div>
    </div>
  );
}