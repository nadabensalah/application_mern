import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContent";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const Login = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContent);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      axios.defaults.withCredentials = true;

      const { data } = await axios.post(backendUrl + "/api/auth/login", formData);
      if (data.success) {
        if (data.isAccountVerified === false) {
          toast.error("Votre compte n'est pas encore vérifié. Vérifiez votre email.");
          return;
        }

        localStorage.setItem("token", data.token);
        setIsLoggedin(true);
        getUserData();
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Une erreur est survenue");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-pink-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="Logo"
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />
      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
        <h2 className="text-3xl font-semibold text-white text-center mb-3">Login</h2>
        <p className="text-center text-sm mb-6">Login to your account!</p>

        <form onSubmit={onSubmitHandler}>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <input
              className="bg-transparent outline-none w-full text-white"
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <input
              className="bg-transparent outline-none w-full text-white"
              type="password"
              name="password"
              placeholder="Mot de passe"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <p onClick={() => navigate("/reset-password")} className="mb-4 text-indigo-500 cursor-pointer">
            Mot de passe oublié ?
          </p>

          <button className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium">
            Login
          </button>
        </form>

        <p className="text-gray-400 text-center text-xs mt-4">
          Vous n'avez pas de compte ?{" "}
          <span onClick={() => navigate("/register")} className="text-blue-400 cursor-pointer underline">
            Inscrivez-vous
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
