// Login.jsx

import { useState } from "react";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem("token", response.data.token);

      alert("Login Successful 🚀");

      window.location.href = "/";
    } catch (error) {
      alert("Login Failed");
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow w-[400px]">

        <h2 className="text-2xl font-bold mb-6 text-center">
          Login to ObserveAI 🔐
        </h2>

        <input
          type="email"
          placeholder="Enter Email"
          className="w-full p-3 border rounded-lg mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter Password"
          className="w-full p-3 border rounded-lg mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-black text-white p-3 rounded-lg"
        >
          Login
        </button>

        <p className="text-center mt-4">
          Don’t have an account?{" "}
          <span
            onClick={() => (window.location.href = "/register")}
            className="text-blue-600 cursor-pointer font-semibold"
          >
            Register
          </span>
        </p>

      </div>
    </div>
  );
}

export default Login;