// Login.jsx

import { useState } from "react";
import axios from "axios";
import {
  Shield,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Activity,
} from "lucide-react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);

      const response = await axios.post("/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);

      alert("Login Successful 🚀");

      window.location.href = "/";
    } catch (error) {
      alert("Login Failed ❌");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-3xl top-[-100px] left-[-100px]" />
      <div className="absolute w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-3xl bottom-[-100px] right-[-100px]" />

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-5xl mx-4 grid md:grid-cols-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">

        {/* Left Side */}
        <div className="hidden md:flex flex-col justify-center p-12 bg-gradient-to-br from-cyan-500/20 to-blue-500/10 border-r border-white/10">

          <div className="flex items-center gap-3 mb-6">
            <div className="bg-cyan-500 p-3 rounded-2xl">
              <Shield className="text-white" size={32} />
            </div>

            <h1 className="text-4xl font-bold text-white">
              APIVIGIL
            </h1>
          </div>

          <p className="text-gray-300 text-lg leading-relaxed mb-10">
            Intelligent API monitoring platform with real-time anomaly
            detection, predictive failure analysis, live alerts,
            observability dashboards, and AI-powered insights.
          </p>

          <div className="space-y-5">

            <div className="flex items-center gap-4">
              <div className="bg-cyan-500/20 p-3 rounded-xl">
                <Activity className="text-cyan-400" />
              </div>

              <div>
                <h3 className="text-white font-semibold">
                  Real-Time Monitoring
                </h3>

                <p className="text-gray-400 text-sm">
                  Track APIs, logs, health, CPU & memory instantly.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-blue-500/20 p-3 rounded-xl">
                <Shield className="text-blue-400" />
              </div>

              <div>
                <h3 className="text-white font-semibold">
                  AI Failure Prediction
                </h3>

                <p className="text-gray-400 text-sm">
                  Predict outages before systems fail.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Right Side */}
        <div className="p-8 md:p-12">

          <div className="flex justify-center md:justify-start mb-8">
            <div className="bg-cyan-500 p-4 rounded-2xl shadow-lg shadow-cyan-500/40">
              <Shield className="text-white" size={32} />
            </div>
          </div>

          <h2 className="text-4xl font-bold text-white mb-2 text-center md:text-left">
            Welcome Back 👋
          </h2>

          <p className="text-gray-400 mb-10 text-center md:text-left">
            Login to continue monitoring your infrastructure.
          </p>

          {/* Email */}
          <div className="relative mb-5">

            <Mail
              className="absolute left-4 top-4 text-gray-400"
              size={20}
            />

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-cyan-500 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

          </div>

          {/* Password */}
          <div className="relative mb-6">

            <Lock
              className="absolute left-4 top-4 text-gray-400"
              size={20}
            />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-xl py-4 pl-12 pr-14 outline-none focus:ring-2 focus:ring-cyan-500 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-4 text-gray-400 hover:text-white"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>

          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-white font-semibold py-4 rounded-xl shadow-xl shadow-cyan-500/30"
          >
            {loading ? "Authenticating..." : "Login Securely"}
          </button>

          {/* Footer */}
          <p className="text-center text-gray-400 mt-8">
            Don’t have an account?{" "}
            <span
              onClick={() => (window.location.href = "/register")}
              className="text-cyan-400 cursor-pointer font-semibold hover:text-cyan-300"
            >
              Create Account
            </span>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Login;
