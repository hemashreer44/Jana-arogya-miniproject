import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LogoutAction() {
  const navigate = useNavigate();

  useEffect(() => {
    // Remove any locally stored user/session data
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // Redirect to login page
    navigate("/login");
  }, [navigate]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white">
      <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
    </div>
  );
}